// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: person.sql

package sqlcmain

import (
	"context"
)

const createPerson = `-- name: CreatePerson :one
INSERT INTO "Person" (prime, first_name, last_name) 
VALUES ($1, $2, $3) 
RETURNING id, prime, first_name, last_name, created_at
`

func (q *Queries) CreatePerson(ctx context.Context, prime string, firstName string, lastName string) (Person, error) {
	row := q.db.QueryRow(ctx, createPerson, prime, firstName, lastName)
	var i Person
	err := row.Scan(
		&i.ID,
		&i.Prime,
		&i.FirstName,
		&i.LastName,
		&i.CreatedAt,
	)
	return i, err
}

const getPersonById = `-- name: GetPersonById :one
SELECT id, prime, first_name, last_name, created_at
FROM "Person"
WHERE
    id = $1
LIMIT 1
`

func (q *Queries) GetPersonById(ctx context.Context, id int64) (Person, error) {
	row := q.db.QueryRow(ctx, getPersonById, id)
	var i Person
	err := row.Scan(
		&i.ID,
		&i.Prime,
		&i.FirstName,
		&i.LastName,
		&i.CreatedAt,
	)
	return i, err
}

const getPersonByPrime = `-- name: GetPersonByPrime :one
SELECT id, prime, first_name, last_name, created_at
FROM "Person"
WHERE 
    prime = $1
LIMIT 1
`

func (q *Queries) GetPersonByPrime(ctx context.Context, prime string) (Person, error) {
	row := q.db.QueryRow(ctx, getPersonByPrime, prime)
	var i Person
	err := row.Scan(
		&i.ID,
		&i.Prime,
		&i.FirstName,
		&i.LastName,
		&i.CreatedAt,
	)
	return i, err
}

const listPerson = `-- name: ListPerson :many
SELECT id, prime, first_name, last_name, created_at
FROM "Person"
ORDER BY id DESC
LIMIT $1 OFFSET $2
`

func (q *Queries) ListPerson(ctx context.Context, limit int32, offset int32) ([]Person, error) {
	rows, err := q.db.Query(ctx, listPerson, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Person
	for rows.Next() {
		var i Person
		if err := rows.Scan(
			&i.ID,
			&i.Prime,
			&i.FirstName,
			&i.LastName,
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
