-- name: ListFace :many
SELECT *
FROM "Face"
ORDER BY id DESC
LIMIT $1 OFFSET $2;