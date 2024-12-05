package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"face.com/gateway/src/api/serializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
)


func (server *Server) createCamera(c *fiber.Ctx) error{
	c.Accepts("application/json")
	serializer := new(serializers.CameraSerializer)
	if err:=server.ValidatePayload(serializer, c); err != nil{
		return err
	}

	camera, err := server.mainStore.CreateCamera(context.Background(), utils.UUID(), serializer.Name, serializer.Type, serializer.URL, serializer.OnDemand)
	if err!=nil{
		return handleSQLError(c, err)
	}

	// TODO: Send through rtsp2web server
	url:=fmt.Sprintf("%s/stream/%s,/add", server.config.Rtsp2Web, camera.Prime)

	data := fiber.Map{
		"name": camera.Name,
		"channels": fiber.Map{
			"name": "channel1",
			"url": camera.Url,
			"on_demand": true,
			"debug": false,
			"status": 0,	
		},
	}

	raw, err := json.Marshal(data)
	if err!=nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"Message": "Cannot convert data to json", "code": FAILED})
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(raw))
	if err!=nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"Message": "Cannot create a new request", "code": FAILED})
	} 

	resp, err := http.DefaultClient.Do(req)
	if err != nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"Message": "Cannot create a new request", "code": FAILED})
	}
	
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "New camera has been created", "code": SUCCESS, "data": camera})
	}
	
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Cannot create new camera", "code": FAILED})
}

func (server *Server) getCameraList(c *fiber.Ctx) error{
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

	cameras, err := server.mainStore.ListCameras(context.Background(),params.PageSize, (params.Page - 1)*params.PageSize)
	if err != nil{
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{"page": params.Page, "page_size": params.PageSize, "results": cameras})
}

func (server *Server) getCameraByPrime(c *fiber.Ctx) error{
	id:=c.Params("id")

	camera, err:=server.mainStore.GetCameraByPrime(context.Background(), id)
	if err != nil{
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{"message": "Camera has been retreived", "code": SUCCESS, "data": camera})
}