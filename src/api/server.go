package api

import (
	"face.com/gateway/src/common"
	sqlcmain "face.com/gateway/src/db/sqlc/main"
	kafka_interface "face.com/gateway/src/interface"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/contrib/websocket"
)

type Server struct {
	app       *fiber.App
	config    *common.Config
	producer  kafka_interface.Producer
	validator *validator.Validate

	mainStore sqlcmain.Store
}

func NewServer(mainStore sqlcmain.Store, config *common.Config, producer kafka_interface.Producer) *Server {
	server := &Server{
		config:    config,
		producer:  producer,
		mainStore: mainStore,
	}

	app := fiber.New(fiber.Config{
		AppName: "App Gateway Service",
	})

	// Set up CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins:     config.CorsAllowOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
		AllowCredentials: true,
	}))

	app.Use(logger.New(logger.Config{
		// For more options, see the Config section
		Format:   "${time} ${pid} ${locals:requestid} ${status} - ${method} ${path}\n",
		TimeZone: config.TimeZone,
	}))

	// Websocket Connection
	app.Use("/ws", func (c *fiber.Ctx) error  {
		if websocket.IsWebSocketUpgrade(c){
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// Add Endpoints
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// Events
	events := v1.Group("/events")
	events.Get("", server.getEventList) // Get Events List
	events.Get("/event/:id", server.getEventByPrime) // Get Event By Prime 

	server.app = app

	server.validator = validator.New()

	return server
}

func (server *Server) Start(address string) error {
	return server.app.Listen(address)
}
