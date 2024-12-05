-- name: CreateCamera :one
INSERT INTO "Camera" (prime, name, type, url, on_demand)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListCameras :many
SELECT * 
FROM "Camera"
ORDER BY id DESC
LIMIT $1 OFFSET $2;

-- name: getCameraByPrime :one
SELECT *
FROM "Camera"
WHERE prime = $1
LIMIT 1;