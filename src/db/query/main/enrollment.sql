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


-- name: ListEnrollmentImage :many
SELECT *
FROM "EnrollmentSessionFile"
WHERE session_id = $1;


-- name: GetEnrollmentVideo :one
SELECT *
FROM "EnrollmentSessionFile"
WHERE session_id = $1
LIMIT 1;


-- name: CreateBulkFace :copyfrom
INSERT INTO "Face" (prime, image, thumbnail, vector, score, indexed)
VALUES ($1, $2, $3, $4, $5, $6);

-- name: ListFacesByPrimes :many
SELECT *
FROM "Face"
WHERE prime = ANY($1::text[]);


-- name: CreateBulkEnrollment :copyfrom
INSERT INTO "Enrollment" (prime, session_id, face_id)
VALUES ($1, $2, $3);

-- name: ListFaceBySessionID :many
SELECT
    EN.id AS enrollment_id,
    EN.prime AS enrollment_prime,
    EN.session_id,
    EN.face_id,
    EN.created_at AS enrollment_created_at,
    F.id AS face_id,
    F.prime AS face_prime,
    F.image AS face_image,
    F.thumbnail AS face_thumbnail,
    F.vector AS face_vector,
    F.score AS face_score,
    F.indexed AS face_indexed,
    ENS.id AS session_id,
    ENS.prime AS session_prime,
    ENS.type AS session_type,
    ENS.status AS session_status,
    ENS.person_id AS session_person_id,
    ENS.created_at AS session_created_at
FROM
    "Enrollment" AS EN
        JOIN
    "Face" AS F ON EN.face_id = F.id
        JOIN
    "EnrollmentSession" AS ENS ON EN.session_id = ENS.id
WHERE
    ENS.id = $1;

-- name: ListFaceBySessionIDAndEnrollmentPrimes :many
SELECT
    EN.id AS enrollment_id,
    EN.prime AS enrollment_prime,
    EN.session_id,
    EN.face_id,
    EN.created_at AS enrollment_created_at,
    F.id AS face_id,
    F.prime AS face_prime,
    F.image AS face_image,
    F.thumbnail AS face_thumbnail,
    F.vector AS face_vector,
    F.score AS face_score,
    F.indexed AS face_indexed,
    ENS.id AS session_id,
    ENS.prime AS session_prime,
    ENS.type AS session_type,
    ENS.status AS session_status,
    ENS.person_id AS session_person_id,
    ENS.created_at AS session_created_at
FROM
    "Enrollment" AS EN
        JOIN
    "Face" AS F ON EN.face_id = F.id
        JOIN
    "EnrollmentSession" AS ENS ON EN.session_id = ENS.id
WHERE
    ENS.id = $1
  AND EN.prime = ANY($2::varchar[]);
