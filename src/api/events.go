package api

import (
	"context"
	"github.com/gofiber/fiber/v2"
)

func (server *Server) getEventList(c *fiber.Ctx) error {

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

	events, err := server.mainStore.GetEventsList(context.Background(), params.PageSize, (params.Page - 1)*params.PageSize)

	if err != nil {
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"page": params.Page, "page_size": params.PageSize, "results": events})
}
