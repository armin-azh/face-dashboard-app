package main

import (
	"context"
	"face.com/gateway/src/listener"
	"fmt"
	"os"
	"os/signal"
	"time"

	"face.com/gateway/src/api"
	"face.com/gateway/src/common"
	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/gofiber/fiber/v2/log"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"

	sqlcmain "face.com/gateway/src/db/sqlc/main"
)

func main() {
	// Signal Interrupt
	signalChat := make(chan os.Signal, 1)
	signal.Notify(signalChat, os.Interrupt)

	go func() {
		<-signalChat
		log.Info("Signal Interrupt occurred")
		os.Exit(0)
	}()

	log.Info("Starting App Gateway Service")

	// Try to read app config path
	cfgPath := os.Getenv("APP_CONFIG")
	if cfgPath == "" {
		cfgPath = "."
	}

	// Check if the config file is existing or not
	cfgPathInfo, err := os.Stat(cfgPath)
	if err != nil {
		log.Error("Cannot find config file", err)
		return
	}

	// Check if the config is directory or file
	if !cfgPathInfo.IsDir() {
		log.Errorf("%s is not a directory", cfgPath)
		return
	}

	// Try to load configs
	config, err := common.LoadConfig(cfgPath)
	if err != nil {
		log.Error(err)
		return
	}

	// Connect to kafka
	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": config.KafkaBootStr,
	})

	if err != nil {
		log.Error(err)
		return
	}
	defer producer.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	metadata, err := producer.GetMetadata(nil, true, 5000)
	if err != nil {
		log.Error("Failed to get metadata: ", err)
		return
	}

	select {
	case <-ctx.Done():
		log.Error("Context timeout while getting metadata")
		return
	default:
		log.Info("Successfully connected to Kafka. Cluster contains ", len(metadata.Brokers), " broker(s)")
	}

	// Connect to database
	dbpool, err := pgxpool.New(context.Background(), config.DatabaseUrl)
	if err != nil {
		log.Error("Cannot connect to the database")
		os.Exit(1)
	}
	defer dbpool.Close()

	err = dbpool.Ping(context.Background())
	if err != nil {
		log.Errorf("Unable to ping the database: %v\n", err)
		os.Exit(1)
	}

	log.Info("Database connection pool has been established successfully!")

	// Connect to redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     config.RedisAddr,
		Password: config.RedisPassword,
		DB:       0,
	})
	log.Info("Redis database has been connected!")

	mainStore := sqlcmain.NewStore(dbpool)

	// Establish listeners
	go func() {
		listener.ResultListener(config.KafkaBootStr, config.MediaDir, mainStore, config.CentrifugoHOST, config.CentrifugoAPIKEY)
	}()

	go func() {
		listener.EventListener(config.KafkaBootStr, config.MediaDir, mainStore, config.CentrifugoHOST, config.CentrifugoAPIKEY)
	}()

	// Run the server
	server := api.NewServer(mainStore, config, producer, rdb)
	if err := server.Start(fmt.Sprintf("%s:%d", config.Host, config.Port)); err != nil {
		log.Fatal("Cannot start server", err)
	}
}
