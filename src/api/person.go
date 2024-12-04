package api

import (
	"context"
	"fmt"

	"face.com/gateway/src/api/serializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
)

func (server *Server) getPersonList(c *fiber.Ctx) error {
	return nil
}

func (server *Server) getPersonByPrime(c *fiber.Ctx) error {
	return nil
}

func (server *Server) createPerson(c *fiber.Ctx) error {
	c.Accepts("application/json")
	serializer := new(serializers.PersonSerializer)
	if err:=server.ValidatePayload(serializer, c); err != nil {
		return err
	}

	person,err := server.mainStore.CreatePerson(context.Background(), utils.UUID(), serializer.FirstName, serializer.LastName)
	
	if err != nil {
		fmt.Println(err)
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message":"Person has been added successfully", "code": SUCCESS,"data": person})
}

func (server *Server) getPersonEventList(c *fiber.Ctx) error {
	return nil
}

func (server *Server) getPersonFaceList(c *fiber.Ctx) error{
	return nil
}

func (server *Server) createEnrollment(c *fiber.Ctx) error {
	return nil
}

func (server *Server) getEnrollmentList(c *fiber.Ctx) error{
	return nil
}

