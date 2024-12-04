package api

import "github.com/gofiber/fiber/v2"

const (
	E_TYPE_VIDEO     = "video"
	E_TYPE_IMAGE     = "image"
	E_TYPE_RECORDING = "recording"
)

const (
	E_STATUS_CREATED    = "created"
	E_STATUS_STAGED     = "staged"
	E_STATUS_PROCESSING = "processing"
	E_STATUS_FAILED     = "failed"
	E_STATUS_COMMIT     = "commit"
)

func (server *Server) getEnrollmentByPrime(c *fiber.Ctx) error {

	return nil
}
