package api

import (
	"context"

	"github.com/gofiber/fiber/v2"
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

func (server *Server) getEnrollmentList(c *fiber.Ctx) error{
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

	enrollments, err := server.mainStore.ListEnrollmentSession(context.Background(),params.PageSize, (params.Page - 1)*params.PageSize)
	if err!=nil{
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"page": params.Page, "page_size": params.PageSize, "results": enrollments})
}

func (server *Server) getEnrollmentByPrime(c *fiber.Ctx) error {

	id := c.Params("id")

	enrollment, err := server.mainStore.GetEnrollmentSessionByPrime(context.Background(),id)
	if err!=nil{
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"data": enrollment, "message": "enrollment has been retreived successfully", "code": SUCCESS})
}
