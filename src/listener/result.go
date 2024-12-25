package listener

import (
	"bytes"
	"context"
	"encoding/json"
	sqlcmain "face.com/gateway/src/db/sqlc/main"
	pb "face.com/gateway/src/proto"
	"fmt"
	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/utils"
	"google.golang.org/protobuf/proto"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
)

// saveImage saves a byte slice to an image file
func saveImage(data []byte, fileName string) error {
	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	_, err = file.Write(data)
	if err != nil {
		return err
	}

	return nil
}

type EnrollmentNotification struct {
	Prime  string `json:"prime"`
	Status string `json:"status"`
}

func ResultListener(bootstrapServer string, mediaRoot string, mainStore sqlcmain.Store, centrifugoHost string, centrifugoAPIKey string) {
	// Kafka consumer setup
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": bootstrapServer,
		"group.id":          "face-result",
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

		}
	}(consumer)

	// Subscribe to Kafka topic
	var topics = []string{"com.result.0", "com.result.1"}
	err = consumer.SubscribeTopics(topics, nil)
	if err != nil {
		log.Error("Failed to subscribe to Kafka topic:", err)
		return
	}
	for _, topic := range topics {
		log.Infof("Subscribed to Kafka topic: %s", topic)
	}

	log.Info("Result Listener is now starting ...")

	for {
		msg, err := consumer.ReadMessage(-1)
		if err != nil {
			log.Errorf("Error reading Kafka message: %v", err)
			continue
		}

		log.Debugf("Received message from topic %s", *msg.TopicPartition.Topic)

		if *msg.TopicPartition.Topic == "com.result.0" {
			var result pb.EnrollmentResult
			err = proto.Unmarshal(msg.Value, &result)
			if err != nil {
				log.Errorf("Error unmarshaling enrollment result: %v", err)
				continue
			}

			enrollment, err := mainStore.GetEnrollmentSessionByPrime(context.Background(), result.SessionId)
			if err != nil {
				log.Errorf("Error getting enrollment session id %s : %v", result.SessionId, err)
				continue
			}

			if result.Status == pb.Status_Success {

				// Save Images
				var faces []sqlcmain.CreateBulkFaceParams
				var facePrimes []string
				for _, face := range result.Faces {
					var faceParams = sqlcmain.CreateBulkFaceParams{
						Prime:   utils.UUID(),
						Indexed: false,
						Score:   1.,
					}
					if len(face.AlignFace) > 0 {
						// build full and relative path
						filename := fmt.Sprintf("face_%s.jpg", utils.UUID())

						relativePath := fmt.Sprintf("sessions/%s/assets/%s", enrollment.Prime, filename)
						faceParams.Image = relativePath

						fullPath := path.Join(mediaRoot, relativePath)

						// Make directories
						err = os.MkdirAll(filepath.Dir(fullPath), 0755)
						if err != nil {
							log.Errorf("Error creating media directory %s: %v", filepath.Dir(fullPath), err)
							continue
						}

						// Save image
						err := saveImage(face.AlignFace, fullPath)
						if err != nil {
							log.Errorf("Error saving face: %v", err)
						}

					}

					if len(face.Thumbnail) > 0 {
						thumbnailFilename := fmt.Sprintf("face_thumbnail_%s.jpg", utils.UUID())
						relativeThumbnailPath := fmt.Sprintf("sessions/%s/assets/%s", enrollment.Prime, thumbnailFilename)
						faceParams.Thumbnail = relativeThumbnailPath
						fullThumbnailPath := path.Join(mediaRoot, relativeThumbnailPath)

						// Make directories
						err = os.MkdirAll(filepath.Dir(relativeThumbnailPath), 0755)
						if err != nil {
							log.Errorf("Error creating media directory %s: %v", filepath.Dir(relativeThumbnailPath), err)
							continue
						}

						// Save image
						err = saveImage(face.AlignFace, fullThumbnailPath)
						if err != nil {
							log.Errorf("Error saving face: %v", err)
						}
					}

					// Save face data in database
					vector := make([]float64, len(face.Embedding))
					for i, val := range face.Embedding {
						vector[i] = val
					}

					faceParams.Vector = vector

					faces = append(faces, faceParams)
					facePrimes = append(facePrimes, faceParams.Prime)
				}

				_, err = mainStore.CreateBulkFace(context.Background(), faces)
				if err != nil {
					log.Errorf("Error creating status: %v", err)
				}

				facesList, err := mainStore.ListFacesByPrimes(context.Background(), facePrimes)

				var enrollmentParams []sqlcmain.CreateBulkEnrollmentParams

				for _, face := range facesList {
					enrollmentParams = append(enrollmentParams, sqlcmain.CreateBulkEnrollmentParams{Prime: utils.UUID(), SessionID: enrollment.ID, FaceID: &face.ID})
				}

				_, err = mainStore.CreateBulkEnrollment(context.Background(), enrollmentParams)
				if err != nil {
					log.Errorf("Error creating enrollment status: %v", err)
				}

				// Change enrollment status
				err = mainStore.UpdateEnrollmentStatusByID(context.Background(), enrollment.ID, "confirm")
				if err != nil {
					log.Errorf("Error updating enrollment status: %v", err)
				}

				// Send to Centrigugo
				instance := EnrollmentNotification{Prime: enrollment.Prime, Status: "confirm"}

				// URL and headers
				url := fmt.Sprintf("%s/api/publish", centrifugoHost)
				headers := map[string]string{
					"Authorization": fmt.Sprintf("apikey %s", centrifugoAPIKey),
					"Content-Type":  "application/json",
				}

				// Payload
				payload := map[string]interface{}{
					"channel": fmt.Sprintf("enrollment:#%s", enrollment.Prime),
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

			} else if result.Status == pb.Status_InternalFailure || result.Status == pb.Status_ExternalFailure {
				// TODO: This should be implemented
			} else {
				log.Errorf("Invalid result status: %v", result.Status)
				continue
			}
		} else if *msg.TopicPartition.Topic == "com.result.1" {

		} else {
			log.Warnf("This topic is not currently enrolled: %s", *msg.TopicPartition.Topic)
		}
	}
}
