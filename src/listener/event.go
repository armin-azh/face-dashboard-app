package listener

import (
	sqlcmain "face.com/gateway/src/db/sqlc/main"
	eventPb "face.com/gateway/src/proto/event"
	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/gofiber/fiber/v2/log"
	"google.golang.org/protobuf/proto"
)

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
		log.Debug(event)

	}
}
