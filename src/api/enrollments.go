package api

import (
	"context"
	"os/exec"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

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

var (
	mutex       sync.Mutex
	isExecuting bool
)

func (server *Server) getEnrollmentList(c *fiber.Ctx) error {
	params := struct {
		Page     int32
		PageSize int32
	}{
		Page:     1,
		PageSize: 10,
	}

	if err := c.QueryParser(&params); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse query parameters",
		})
	}

	enrollments, err := server.mainStore.ListEnrollmentSession(context.Background(), params.PageSize, (params.Page-1)*params.PageSize)
	if err != nil {
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"page": params.Page, "page_size": params.PageSize, "results": enrollments})
}

func (server *Server) getEnrollmentByPrime(c *fiber.Ctx) error {

	id := c.Params("id")

	enrollment, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"data": enrollment, "message": "enrollment has been retreived successfully", "code": SUCCESS})
}

func (server *Server) recordingEnrollment(c *fiber.Ctx) error {
	id := c.Params("id")

	enrollment, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}

	if enrollment.Type != E_TYPE_RECORDING {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "you cannot not start recording for this enrollment", "code": InvalidOperation})
	}

	if isExecuting {
		return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{"message": "Another recording is already running, please try again"})
	}

	mutex.Lock()
	isExecuting = true

	log.Info("Command is running on background")

	go func() {
		defer func() {
			mutex.Unlock()
			isExecuting = false
		}()

		cmd := exec.Command("sh", "-c", "ffmpeg -hide_banner -y -loglevel error -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i rtsp://localhost:8554/sample2 -vf scale=1280x720 -f mp4 -t 5 sample.mp4")
		output, err := cmd.CombinedOutput()

		if err != nil {
			log.Errorf("Error executing command: %s\n", err.Error())
		} else {
			log.Errorf("Command output: %s\n", output)
		}

	}()

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{"message": "start recording", "code": SUCCESS})
}
