package api

import (
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/lib/pq"
)

func handleSQLError(c *fiber.Ctx, err error) error {
	var pgErr *pq.Error
	if errors.As(err, &pgErr) {
		log.Info(pgErr.Code.Name())
		return &fiber.Error{
			Code:    fiber.ErrBadRequest.Code,
			Message: fmt.Sprintf("%v", err),
		}
	}
	return &fiber.Error{
		Code:    fiber.ErrBadRequest.Code,
		Message: "Bad request happened",
	}
}
