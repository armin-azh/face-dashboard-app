package listener

import (
	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/gofiber/fiber/v2/log"
)

func ResultListener(bootstrapServer string) {
	// Kafka consumer setup
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": bootstrapServer,
		"group.id":          "face-result",
		"auto.offset.reset": "earliest",
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
	topic := "com.result.0"
	err = consumer.SubscribeTopics([]string{topic}, nil)
	if err != nil {
		log.Error("Failed to subscribe to Kafka topic:", err)
		return
	}
	log.Infof("Subscribed to Kafka topic: %s", topic)

	log.Info("Result Listener is now starting ...")

	for {
		msg, err := consumer.ReadMessage(-1)
		if err != nil {
			log.Errorf("Error reading Kafka message: %v", err)
			continue
		}

		log.Infof("Received message from topic %s: %s", *msg.TopicPartition.Topic, string(msg.Value))

		// Process the message (example processing logic)
		log.Debug(msg.Value)
	}
}
