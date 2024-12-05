package api

import (
	"context"

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
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "New camera has been created", "code": SUCCESS, "data": camera})
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