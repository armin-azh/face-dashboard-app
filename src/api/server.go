package api

import (
	"face.com/gateway/src/common"
	sqlcmain "face.com/gateway/src/db/sqlc/main"
	kafka_interface "face.com/gateway/src/interface"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/redis/go-redis/v9"
)

type Server struct {
	app       *fiber.App
	config    *common.Config
	producer  kafka_interface.Producer
	validator *validator.Validate
	rdb       *redis.Client

	mainStore sqlcmain.Store
}

func NewServer(mainStore sqlcmain.Store, config *common.Config, producer kafka_interface.Producer, rdb *redis.Client) *Server {
	server := &Server{
		config:    config,
		producer:  producer,
		mainStore: mainStore,
		rdb:       rdb,
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

	// Add Endpoints
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// Events
	events := v1.Group("/events")
	events.Get("", server.getEventList)              // Get Events List
	events.Get("/event/:id", server.getEventByPrime) // Get Event By Prime

	// Persons
	persons := v1.Group("/persons")
	persons.Get("", server.getPersonList)                                    // Get Persons List
	persons.Post("", server.createPerson)                                    // Create new person
	persons.Get("/person/:id", server.getPersonByPrime)                      // Get Person By Id
	persons.Get("/person/:id/events", server.getPersonEventList)             // Get Person Event List
	persons.Get("/person/:id/faces", server.getPersonFaceList)               // Get Person Face List
	persons.Post("/person/:id/enrollments", server.createEnrollment)         // Create New Enrollment
	persons.Get("/person/:id/enrollments", server.getEnrollmentListByPerson) // Get Enrollment List

	// Enrollments
	enrollments := v1.Group("/enrollments")
	enrollments.Get("", server.getEnrollmentList)                            // Get Enrollment List
	enrollments.Get("/enrollment/:id", server.getEnrollmentByPrime)          // Get Enrollment By Prime
	enrollments.Get("/enrollment/:id/jwt", server.generateEnrollmentJWT)     // Get Enrollment By Prime
	enrollments.Get("/enrollment/:id/recording", server.recordingEnrollment) // Start recording
	enrollments.Post("/enrollment/:id/video", server.uploadVideo)            // Upload video
	enrollments.Post("/enrollment/:id/images", server.uploadImages)          // Upload images
	enrollments.Get("/enrollment/:id/process", server.doProcess)             // put enrollment on queue
	enrollments.Post("/enrollment/:id/complete", server.completeEnrollment)  // Complete the enrollment

	// Camera
	cameras := v1.Group("/cameras")
	cameras.Post("", server.createCamera)                  // Create Camera by Prime
	cameras.Get("", server.getCameraList)                  // Get Camera List
	cameras.Get("/camera/:id", server.getCameraByPrime)    // Get Camera by prime
	cameras.Get("/camera/:id/reload", server.reloadCamera) // Reload camera
	cameras.Delete("/camera/:id", server.deleteCamera)     // Delete camera

	server.app = app

	server.validator = validator.New()

	return server
}

func (server *Server) Start(address string) error {
	return server.app.Listen(address)
}
