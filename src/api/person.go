package api

import (
	"context"
	"fmt"

	"face.com/gateway/src/api/serializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
)

func (server *Server) getPersonList(c *fiber.Ctx) error {

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

	persons, err := server.mainStore.ListPerson(context.Background(), params.PageSize, (params.Page - 1)*params.PageSize)
	if err!=nil{
		return handleSQLError(c, err)
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"page": params.Page, "page_size": params.PageSize, "results": persons})
}

func (server *Server) getPersonByPrime(c *fiber.Ctx) error {
	id := c.Params("id")

	person, err := server.mainStore.GetPersonByPrime(context.Background(), id)
	if err!=nil{
		return handleSQLError(c, err)
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "person has been retrieved", "code": SUCCESS, "data": person})
}

func (server *Server) createPerson(c *fiber.Ctx) error {
	c.Accepts("application/json")
	serializer := new(serializers.PersonSerializer)
	if err:=server.ValidatePayload(serializer, c); err != nil {
		return err
	}

	person,err := server.mainStore.CreatePerson(context.Background(), utils.UUID(), serializer.FirstName, serializer.LastName)
	
	if err != nil {
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
	c.Accepts("application/json")
	id := c.Params("id")

	serializer := new(serializers.EnrollmentSerializer)
	if err:=server.ValidatePayload(serializer, c); err != nil {
		return err
	}

	person,err:=server.mainStore.GetPersonByPrime(context.Background(), id)
	if err!=nil{
		return handleSQLError(c, err)
	}

	enrollment, err := server.mainStore.CreateEnrollmentSession(context.Background(),utils.UUID(), serializer.Type,E_STATUS_CREATED, person.ID)
	if err!=nil{
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": fmt.Sprintf("New session has been created for %s person", person.Prime), "code": SUCCESS, "data": enrollment})
}

func (server *Server) getEnrollmentListByPerson(c *fiber.Ctx) error{
	id := c.Params("id")
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

	person, err := server.mainStore.GetPersonByPrime(context.Background(), id)
	if err!=nil{
		return handleSQLError(c, err)
	}

	enrollments, err := server.mainStore.ListEnrollmentSessionByPerson(context.Background(), person.ID, params.PageSize, (params.Page - 1)*params.PageSize)
	if err!=nil{
		return handleSQLError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"page": params.Page, "page_size": params.PageSize, "results": enrollments})
}

