// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlcmain

import (
	"context"
)

type Querier interface {
	GetEventByPrime(ctx context.Context, prime string) (GetEventByPrimeRow, error)
	GetEventsList(ctx context.Context, limit int32, offset int32) ([]GetEventsListRow, error)
	ListFace(ctx context.Context, limit int32, offset int32) ([]Face, error)
}

var _ Querier = (*Queries)(nil)
