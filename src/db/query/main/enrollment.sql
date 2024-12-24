-- name: CreateEnrollmentSession :one
INSERT INTO "EnrollmentSession" (prime, "type", "status", person_id) 
VALUES ($1, $2, $3, $4) 
RETURNING *;

-- name: ListEnrollmentSessionByPerson :many
SELECT *
FROM "EnrollmentSession"
WHERE person_id = $1
ORDER BY id DESC
LIMIT $2 OFFSET $3;

-- name: ListEnrollmentSession :many
SELECT *
FROM "EnrollmentSession"
ORDER BY id DESC
LIMIT $1 OFFSET $2;

-- name: GetEnrollmentSessionByPrime :one
SELECT *
FROM "EnrollmentSession"
WHERE prime = $1
LIMIT 1;

-- name: CreateBulkEnrollmentFiles :copyfrom
INSERT INTO "EnrollmentSessionFile" (prime, session_id, path)
VALUES ($1, $2,$3);

-- name: CreateEnrollmentFile :one
INSERT INTO "EnrollmentSessionFile" (prime, session_id, path)
VALUES ($1, $2,$3) RETURNING *;

-- name: UpdateEnrollmentStatusByID :exec
UPDATE "EnrollmentSession"
SET "status" = $2
WHERE "id" = $1;
