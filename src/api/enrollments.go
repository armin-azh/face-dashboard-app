package api

import (
	"context"
	sqlcmain "face.com/gateway/src/db/sqlc/main"
	srv_proto "face.com/gateway/src/proto"
	"fmt"
	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/utils"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/protobuf/proto"
	"os"
	"path"
	"path/filepath"
	"time"
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
	E_STATUS_CONFIRM    = "confirm"
	E_STATUS_COMMIT     = "commit"
)

func (server *Server) generateEnrollmentJWT(c *fiber.Ctx) error {

	enrollmentId := c.Params("id")

	_, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), enrollmentId)
	if err != nil {
		return handleSQLError(c, err)
	}

	var jwtSecret = []byte(server.config.JwtSecret)

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":      enrollmentId,
		"channels": []string{fmt.Sprintf("enrollment:#%s", enrollmentId)},
	}).SignedString(jwtSecret)

	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"token": token})
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
	//id := c.Params("id")
	//
	//enrollment, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	//if err != nil {
	//	return handleSQLError(c, err)
	//}
	//
	//if enrollment.Type != E_TYPE_RECORDING {
	//	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "you cannot not start recording for this enrollment", "code": InvalidOperation})
	//}
	//
	//	// Execute the command
	//	cmd := exec.Command("sh", "-c", "ffmpeg -hide_banner -y -loglevel error -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i rtsp://localhost:8554/sample2 -vf scale=1280x720 -f mp4 -t 5 sample.mp4")
	//	output, err := cmd.CombinedOutput()
	//
	//	response = EnrollmentMessageResponse{
	//		Action: E_ACTION_END_RECORDING,
	//	}
	//
	//	if err != nil {
	//		log.Errorf("Error executing command: %s\n", err.Error())
	//		response.Message = fmt.Sprintf("Error executing command: %s", err.Error())
	//	} else {
	//		log.Infof("Command output: %s\n", output)
	//		response.Message = fmt.Sprintf("Command output: %s", output)
	//	}
	//
	//	// Send end recording status
	//
	//	data, err = json.Marshal(response)
	//	if err != nil {
	//		log.Errorf("Error marshaling data %s", err.Error())
	//		return
	//	}
	//
	//	for client := range enrollmentWsClients {
	//		err = client.WriteMessage(websocket.TextMessage, data)
	//		if err != nil {
	//			log.Errorf("Error sending data: %s", err.Error())
	//			client.Close()
	//			delete(enrollmentWsClients, client)
	//		}
	//	}
	//
	//}()

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{"message": "start recording", "code": SUCCESS})
}

func (server *Server) uploadVideo(c *fiber.Ctx) error {
	id := c.Params("id")

	enrollment, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}

	if enrollment.Status != E_STATUS_CREATED {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "File has been uploaded before",
			"code":    FAILED,
		})
	}

	if enrollment.Type != E_TYPE_VIDEO {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "You cannot have permission to upload file to VIDEO",
			"code":    FAILED,
		})
	}

	file, err := c.FormFile("video")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "No file uploaded", "code": NoFile})
	}

	// build full and relative path
	relativePath := fmt.Sprintf("sessions/%s/assets/%s", enrollment.Prime, file.Filename)
	fullPath := path.Join(server.config.MediaDir, relativePath)

	// Make directories
	err = os.MkdirAll(filepath.Dir(fullPath), 0755)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Cannot create subdirectory", "code": InternalFailure})
	}

	// Save the uploaded file to the full path
	err = c.SaveFile(file, fullPath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to save file",
			"code":    FileError,
		})
	}

	// Save path on enrollment
	fileParam := sqlcmain.TxEnrollmentFile{
		Prime:      utils.UUID(),
		SessionId:  enrollment.ID,
		Path:       relativePath,
		NextStatus: E_STATUS_STAGED,
	}
	enrollmentFile, err := server.mainStore.CreateEnrollmentFileTx(context.Background(), fileParam)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error(), "code": InternalFailure})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "new file has been stored", "code": SUCCESS, "data": enrollmentFile})
}

func (server *Server) uploadImages(c *fiber.Ctx) error {
	id := c.Params("id")

	_, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}

	//_, err := c.MultipartForm()
	//if err != nil{
	//	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	//		"message": "No image files were provided",
	//		"code": FAILED,
	//	})
	//}
	//
	return nil
}

func (server *Server) doProcess(c *fiber.Ctx) error {
	id := c.Params("id")

	enrollment, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}

	enroll := &srv_proto.Enrollment{
		SessionId: enrollment.Prime,
		Type:      srv_proto.Type_Video,
	}

	if enrollment.Status != E_STATUS_STAGED {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "You cannot process this session", "code": InvalidOperation})
	}

	if enrollment.Type == E_TYPE_VIDEO || enrollment.Type == E_TYPE_RECORDING {

		file, err := server.mainStore.GetEnrollmentVideo(context.Background(), enrollment.ID)

		if err != nil {
			return handleSQLError(c, err)
		}
		enroll.VideoPath = file.Path

	} else if enrollment.Type == E_TYPE_IMAGE {

		files, err := server.mainStore.ListEnrollmentImage(context.Background(), enrollment.ID)
		if err != nil {
			return handleSQLError(c, err)
		}

		var imageFiles []*srv_proto.ImageFile

		for _, file := range files {
			imageFile := &srv_proto.ImageFile{Path: file.Path}

			imageFiles = append(imageFiles, imageFile)
		}

		enroll.Images = imageFiles
	} else {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid file type", "code": InvalidOperation})
	}

	// Send it through broker

	deliveryChan := make(chan kafka.Event, 1)

	payload, err := proto.Marshal(enroll)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot encode the proto data"})
	}

	qName := "com.enrollment.0"

	go func() {
		if err := server.producer.Produce(&kafka.Message{TopicPartition: kafka.TopicPartition{Topic: &qName, Partition: kafka.PartitionAny}, Value: payload}, deliveryChan); err != nil {
			log.Info(err.Error())
		}
		server.producer.Flush(15 * 1000)
	}()

	select {
	case e := <-deliveryChan:
		m := e.(*kafka.Message)
		if m.TopicPartition.Error != nil {
			log.Errorf("Delivery failed: %v\n", m.TopicPartition.Error)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to send message to Kafka",
				"code":    DeliveryFailure,
			})
		}

		log.Debugf("Delivered message to Kafka: %v\n", string(m.Value))

		err = server.mainStore.UpdateEnrollmentStatusByID(context.Background(), enrollment.ID, E_STATUS_PROCESSING)

		if err != nil {
			return handleSQLError(c, err)
		}

	case <-time.After(10 * time.Second):
		err = c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Kafka delivery report timed out", "code": KafkaTimeout})
	}

	close(deliveryChan) // Ensure the channel is closed

	return err
}
