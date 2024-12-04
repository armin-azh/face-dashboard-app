-- name: CreateEnrollmentSession :one
INSERT INTO "EnrollmentSession" (prime, "type", "status", person_id) 
VALUES ($1, $2, $3, $4) 
RETURNING *;