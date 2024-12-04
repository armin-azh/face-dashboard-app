package kafka_interface

import "github.com/confluentinc/confluent-kafka-go/v2/kafka"

type Producer interface {
	Produce(msg *kafka.Message, deliveryChan chan kafka.Event) error
	Flush(timeoutMs int) int
}
