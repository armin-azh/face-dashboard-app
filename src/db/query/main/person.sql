-- name: CreatePerson :one
INSERT INTO "Person" (prime, first_name, last_name) 
VALUES ($1, $2, $3) 
RETURNING *;