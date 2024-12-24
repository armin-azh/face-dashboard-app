// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: enrollment.sql

package sqlcmain

import (
	"context"
)

type CreateBulkEnrollmentFilesParams struct {
	Prime     string `json:"prime"`
	SessionID int64  `json:"session_id"`
	Path      string `json:"path"`
}

const createEnrollmentFile = `-- name: CreateEnrollmentFile :one
INSERT INTO "EnrollmentSessionFile" (prime, session_id, path)
VALUES ($1, $2,$3) RETURNING id, session_id, prime, path, created_at
`

func (q *Queries) CreateEnrollmentFile(ctx context.Context, prime string, sessionID int64, path string) (EnrollmentSessionFile, error) {
	row := q.db.QueryRow(ctx, createEnrollmentFile, prime, sessionID, path)
	var i EnrollmentSessionFile
	err := row.Scan(
		&i.ID,
		&i.SessionID,
		&i.Prime,
		&i.Path,
		&i.CreatedAt,
	)
	return i, err
}

const createEnrollmentSession = `-- name: CreateEnrollmentSession :one
INSERT INTO "EnrollmentSession" (prime, "type", "status", person_id) 
VALUES ($1, $2, $3, $4) 
RETURNING id, prime, type, status, person_id, created_at
`

func (q *Queries) CreateEnrollmentSession(ctx context.Context, prime string, type_ string, status string, personID int64) (EnrollmentSession, error) {
	row := q.db.QueryRow(ctx, createEnrollmentSession,
		prime,
		type_,
		status,
		personID,
	)
	var i EnrollmentSession
	err := row.Scan(
		&i.ID,
		&i.Prime,
		&i.Type,
		&i.Status,
		&i.PersonID,
		&i.CreatedAt,
	)
	return i, err
}

const getEnrollmentSessionByPrime = `-- name: GetEnrollmentSessionByPrime :one
SELECT id, prime, type, status, person_id, created_at
FROM "EnrollmentSession"
WHERE prime = $1
LIMIT 1
`

func (q *Queries) GetEnrollmentSessionByPrime(ctx context.Context, prime string) (EnrollmentSession, error) {
	row := q.db.QueryRow(ctx, getEnrollmentSessionByPrime, prime)
	var i EnrollmentSession
	err := row.Scan(
		&i.ID,
		&i.Prime,
		&i.Type,
		&i.Status,
		&i.PersonID,
		&i.CreatedAt,
	)
	return i, err
}

const listEnrollmentSession = `-- name: ListEnrollmentSession :many
SELECT id, prime, type, status, person_id, created_at
FROM "EnrollmentSession"
ORDER BY id DESC
LIMIT $1 OFFSET $2
`

func (q *Queries) ListEnrollmentSession(ctx context.Context, limit int32, offset int32) ([]EnrollmentSession, error) {
	rows, err := q.db.Query(ctx, listEnrollmentSession, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []EnrollmentSession
	for rows.Next() {
		var i EnrollmentSession
		if err := rows.Scan(
			&i.ID,
			&i.Prime,
			&i.Type,
			&i.Status,
			&i.PersonID,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listEnrollmentSessionByPerson = `-- name: ListEnrollmentSessionByPerson :many
SELECT id, prime, type, status, person_id, created_at
FROM "EnrollmentSession"
WHERE person_id = $1
ORDER BY id DESC
LIMIT $2 OFFSET $3
`

func (q *Queries) ListEnrollmentSessionByPerson(ctx context.Context, personID int64, limit int32, offset int32) ([]EnrollmentSession, error) {
	rows, err := q.db.Query(ctx, listEnrollmentSessionByPerson, personID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []EnrollmentSession
	for rows.Next() {
		var i EnrollmentSession
		if err := rows.Scan(
			&i.ID,
			&i.Prime,
			&i.Type,
			&i.Status,
			&i.PersonID,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateEnrollmentStatusByID = `-- name: UpdateEnrollmentStatusByID :exec
UPDATE "EnrollmentSession"
SET "status" = $2
WHERE "id" = $1
`

func (q *Queries) UpdateEnrollmentStatusByID(ctx context.Context, iD int64, status string) error {
	_, err := q.db.Exec(ctx, updateEnrollmentStatusByID, iD, status)
	return err
}
