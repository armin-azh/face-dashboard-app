package listener

import (
	"bytes"
	"context"
	"encoding/json"
	"face.com/gateway/src/common"
	sqlcmain "face.com/gateway/src/db/sqlc/main"
	eventPb "face.com/gateway/src/proto/event"
	"fmt"
	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"google.golang.org/protobuf/proto"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"time"
)

type EventNotification struct {
	Events []sqlcmain.CreateBulkEventParams `json:"events"`
}

func EventListener(bootstrapServer string, mediaRoot string, mainStore sqlcmain.Store, centrifugoHost string, centrifugoAPIKey string) {
	// When execution is terminated
	defer func() { log.Info("Event Listener stopped") }()

	// Kafka consumer setup
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": bootstrapServer,
		"group.id":          "faceEventGroup",
		"auto.offset.reset": "earliest",
		"fetch.max.bytes":   10485760,
	})
	if err != nil {
		log.Error("Failed to create Kafka consumer:", err)
		return
	}
	defer func(consumer *kafka.Consumer) {
		err := consumer.Close()
		if err != nil {
			log.Errorf("Failed to close Kafka consumer: %v", err)
		}
	}(consumer)

	// Subscribe to Kafka topic
	var topics = []string{"com.event.0"}
	err = consumer.SubscribeTopics(topics, nil)
	if err != nil {
		log.Error("Failed to subscribe to Kafka topic:", err)
		return
	}
	for _, topic := range topics {
		log.Infof("Subscribed to Kafka topic: %s", topic)
	}

	log.Info("Event Listener is now starting ...")

	for {
		msg, err := consumer.ReadMessage(-1)
		if err != nil {
			log.Errorf("Error reading Kafka message: %v", err)
			continue
		}
		log.Debugf("Received message from topic %s", *msg.TopicPartition.Topic)

		var event eventPb.FaceSearchEvent
		err = proto.Unmarshal(msg.Value, &event)
		if err != nil {
			log.Errorf("Error unmarshaling event: %v", err)
			continue
		}

		streamId := event.StreamId
		camera, err := mainStore.GetCameraByPrime(context.Background(), streamId)
		if err != nil {
			log.Errorf("Cannot find camera %s: %v", streamId, err)
			continue
		}

		var events []sqlcmain.CreateBulkEventParams
		t := time.Unix(event.Timestamp/1000, (event.Timestamp%1000)*1e6)
		var happenedAt pgtype.Timestamptz
		happenedAt.Time = t
		for _, face := range event.Faces {
			personId := face.PersonId

			var eventParam = sqlcmain.CreateBulkEventParams{Prime: utils.UUID(), Score: float64(face.Score), CameraID: &camera.ID, HappendAt: happenedAt}
			var fullThumbnailPath string
			if personId == "unk" {
				eventParam.PersonID = nil

				// Create thumbnail path
				thumbnailFilename := fmt.Sprintf("face_thumbnail_%s.jpg", utils.UUID())
				relativeThumbnailPath := fmt.Sprintf("/events/%s/%s", eventParam.Prime, thumbnailFilename)
				eventParam.Thumbnail = relativeThumbnailPath
				fullThumbnailPath = path.Join(mediaRoot, relativeThumbnailPath)

			} else {
				person, err := mainStore.GetPersonByPrime(context.Background(), personId)
				if err != nil {
					log.Errorf("Cannot find person %s: %v", personId, err)
					continue
				}

				eventParam.PersonID = &person.ID

				// Create thumbnail path
				thumbnailFilename := fmt.Sprintf("face_thumbnail_%s.jpg", utils.UUID())
				relativeThumbnailPath := fmt.Sprintf("persons/%s/events/%s", person.Prime, thumbnailFilename)
				eventParam.Thumbnail = relativeThumbnailPath
				fullThumbnailPath = path.Join(mediaRoot, relativeThumbnailPath)
			}

			// Make directories
			err = os.MkdirAll(filepath.Dir(fullThumbnailPath), 0755)
			if err != nil {
				log.Errorf("Error creating media directory %s: %v", filepath.Dir(fullThumbnailPath), err)
				continue
			}

			// Save the thumbnail
			err = common.SaveImage(face.FaceThumbnail, fullThumbnailPath)
			if err != nil {
				log.Errorf("Error saving thumbnail: %v", err)
			}
			events = append(events, eventParam)
		}

		if len(events) > 0 {
			_, err = mainStore.CreateBulkEvent(context.Background(), events)

			if err != nil {
				log.Errorf("Error creating events: %v", err)
				continue
			}

			// Send to Centrigugo
			instance := EventNotification{Events: events}

			// URL and headers
			url := fmt.Sprintf("%s/api/publish", centrifugoHost)
			headers := map[string]string{
				"Authorization": fmt.Sprintf("apikey %s", centrifugoAPIKey),
				"Content-Type":  "application/json",
			}

			// Payload
			payload := map[string]interface{}{
				"channel": "event:broadcast",
				"data":    instance, // This uses the serialized instance
			}

			// Serialize payload to JSON
			payloadBytes, err := json.Marshal(payload)
			if err != nil {
				log.Fatalf("Failed to serialize payload: %v", err)
			}

			go func() {

				// Create HTTP request
				req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
				if err != nil {
					log.Fatalf("Failed to create HTTP request: %v", err)
				}

				// Set headers
				for key, value := range headers {
					req.Header.Set(key, value)
				}

				// Make HTTP request
				client := &http.Client{}
				log.Debugf("New notification has been received to send %s", url)
				resp, err := client.Do(req)
				if err != nil {
					log.Fatalf("Failed to send HTTP request: %v", err)
				}
				defer func(Body io.ReadCloser) {
					err := Body.Close()
					if err != nil {

					}
				}(resp.Body)
				// Check response status
				if resp.StatusCode != http.StatusOK {
					log.Errorf("Something happened to broadcast new notification %s, status code: %d", url, resp.StatusCode)
				} else {
					log.Debug("Notification broadcast successfully.")
				}
			}()

		}

	}
}
