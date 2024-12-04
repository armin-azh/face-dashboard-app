// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlcmain

import (
	"context"
)

type Querier interface {
	CreatePerson(ctx context.Context, prime string, firstName string, lastName string) (Person, error)
	GetEventByPrime(ctx context.Context, prime string) (GetEventByPrimeRow, error)
	GetEventsList(ctx context.Context, limit int32, offset int32) ([]GetEventsListRow, error)
	GetPersonByPrime(ctx context.Context, prime string) (Person, error)
	ListFace(ctx context.Context, limit int32, offset int32) ([]Face, error)
	ListPerson(ctx context.Context, limit int32, offset int32) ([]Person, error)
}

var _ Querier = (*Queries)(nil)
