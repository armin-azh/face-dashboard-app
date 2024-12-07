package api

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

type EnrollmentMessageResponse struct {
	Message string `json:"message"`
	Action  string `json:"action"`
}

const (
	E_ACTION_START_RECORDING = "start-recording"
	E_ACTION_END_RECORDING   = "end-recording"
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

var enrollmentWsClients = make(map[*websocket.Conn]bool)

func (server *Server) enrollmentSocketGateway(c *websocket.Conn) {

	enrollmentWsClients[c] = true

	defer func() {
		delete(enrollmentWsClients, c)
		c.Close()
	}()

	id := c.Params("id")

	_, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		log.Errorf("following database error happened: %s", err.Error())

		response := EnrollmentMessageResponse{
			Message: fmt.Sprintf("No row founded for %s", id),
			Action:  ACTION_NO_ROW,
		}

		data, err := json.Marshal(response)
		if err != nil {
			log.Errorf("Error marshalling response JSON: %s", err.Error())
			return
		}

		err = c.WriteMessage(websocket.TextMessage, data)
		if err != nil {
			log.Errorf("Error sending message: %s", err.Error())
		}
		return
	}

	for {
		if _, _, err = c.ReadMessage(); err != nil {
			log.Info("read:", err)
			break
		}
	}
}

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

		// Send start recording
		response := EnrollmentMessageResponse{
			Message: fmt.Sprintf("Enrollment %s recording is now starting", id),
			Action:  E_ACTION_START_RECORDING,
		}

		data, err := json.Marshal(response)
		if err != nil {
			log.Errorf("Error marshaling data %s", err.Error())
			return
		}

		for client := range enrollmentWsClients {
			err = client.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				log.Errorf("Error sending data: %s", err.Error())
				client.Close()
				delete(enrollmentWsClients, client)
			}
		}

		// Execute the command
		cmd := exec.Command("sh", "-c", "ffmpeg -hide_banner -y -loglevel error -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i rtsp://localhost:8554/sample2 -vf scale=1280x720 -f mp4 -t 5 sample.mp4")
		output, err := cmd.CombinedOutput()

		response = EnrollmentMessageResponse{
			Action: E_ACTION_END_RECORDING,
		}

		if err != nil {
			log.Errorf("Error executing command: %s\n", err.Error())
			response.Message = fmt.Sprintf("Error executing command: %s", err.Error())
		} else {
			log.Infof("Command output: %s\n", output)
			response.Message = fmt.Sprintf("Command output: %s", output)
		}

		// Send end recording status

		data, err = json.Marshal(response)
		if err != nil {
			log.Errorf("Error marshaling data %s", err.Error())
			return
		}

		for client := range enrollmentWsClients {
			err = client.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				log.Errorf("Error sending data: %s", err.Error())
				client.Close()
				delete(enrollmentWsClients, client)
			}
		}

	}()

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{"message": "start recording", "code": SUCCESS})
}

func (server *Server) uploadVideo(c *fiber.Ctx) error {
	id := c.Params("id")

	enrollment, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}

	file, err := c.FormFile("video")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "No file uploaded", "code": NoFile})
	}

	relative_path := fmt.Sprintf("/%s/assets/%s", enrollment.Prime, file.Filename)
	full_path := path.Join(server.config.MediaDir, relative_path)

	err = os.MkdirAll(filepath.Dir(full_path), 0755)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Cannot create subdirectory", "code": InternalFailure})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "new file has been stored", "code": SUCCESS})
}

func (server *Server) uploadImages(c *fiber.Ctx) error {
	id := c.Params("id")

	_, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}
	return nil
}
