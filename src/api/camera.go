package api

import (
	"bytes"
	"context"
	"encoding/json"
	sqlcmain "face.com/gateway/src/db/sqlc/main"
	"fmt"
	"io"
	"net/http"

	"face.com/gateway/src/api/serializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/utils"
)

type Channels struct {
	Name     string `json:"name"`
	URL      string `json:"url"`
	OnDemand bool   `json:"on_demand"`
	Debug    bool   `json:"debug"`
	Status   int    `json:"status"`
}

type RTSP struct {
	Name     string `json:"name"`
	Channels map[string]Channels
}

func (server *Server) deleteCamera(c *fiber.Ctx) error {

	id := c.Params("id")

	url := fmt.Sprintf("%s/stream/%s/delete", server.config.Rtsp2Web, id)

	arg := sqlcmain.DeleteCameraParams{
		RTSP2WebURL: url,
		Prime:       id,
	}

	err := server.mainStore.DeleteCamera(context.Background(), arg)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": fmt.Sprintf("Camera %s cannot be deleted because %v", id, err), "code": FAILED})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": fmt.Sprintf("Camera %s has been deleted successfully", id), "code": SUCCESS})
}

func (server *Server) reloadCamera(c *fiber.Ctx) error {
	id := c.Params("id")

	url := fmt.Sprintf("%s/stream/%s/reload", server.config.Rtsp2Web, id)

	// Make the POST request
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalf("Error making POST request: %v", err)
	}

	if resp.StatusCode == 200 {

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": fmt.Sprintf("Camera %s has been reloaded", id), "code": SUCCESS})
	}
	log.Errorf("Camera %s cannot be reloaded", id)
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": fmt.Sprintf("Camera %s cannot be reloaded", id), "code": FAILED})
}

func (server *Server) createCamera(c *fiber.Ctx) error {
	c.Accepts("application/json")
	serializer := new(serializers.CameraSerializer)
	if err := server.ValidatePayload(serializer, c); err != nil {
		return err
	}

	camera, err := server.mainStore.CreateCamera(context.Background(), utils.UUID(), serializer.Name, serializer.Type, serializer.URL, serializer.OnDemand)
	if err != nil {
		return handleSQLError(c, err)
	}

	url := fmt.Sprintf("%s/stream/%s/add", server.config.Rtsp2Web, camera.Prime)

	data := RTSP{
		Name: camera.Name,
		Channels: map[string]Channels{
			"0": {
				Name:     "ch1",
				URL:      camera.Url,
				OnDemand: camera.OnDemand,
				Debug:    false,
				Status:   0,
			},
		},
	}

	raw, err := json.Marshal(data)
	if err != nil {
		log.Errorf("json marshal %s", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"Message": "Cannot convert data to json", "code": FAILED})
	}

	// Make the POST request
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(raw))
	if err != nil {
		log.Fatalf("Error making POST request: %v", err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Fatalf("Error closing body: %v", err)
		}
	}(resp.Body)

	if resp.StatusCode == 200 {

		server.rdb.LPush(context.Background(), "active-streams", camera.Prime)

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "New camera has been created", "code": SUCCESS, "data": camera})
	}
	log.Errorf("cannot create new camera: %s", resp.StatusCode)
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Cannot create new camera", "code": FAILED})
}

func (server *Server) getCameraList(c *fiber.Ctx) error {
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

	cameras, err := server.mainStore.ListCameras(context.Background(), params.PageSize, (params.Page-1)*params.PageSize)
	if err != nil {
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"page": params.Page, "page_size": params.PageSize, "results": cameras})
}

func (server *Server) getCameraByPrime(c *fiber.Ctx) error {
	id := c.Params("id")

	camera, err := server.mainStore.GetCameraByPrime(context.Background(), id)
	if err != nil {
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Camera has been retrieved", "code": SUCCESS, "data": camera})
}
