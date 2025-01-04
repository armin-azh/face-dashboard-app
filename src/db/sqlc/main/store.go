package sqlcmain

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Store Define list of all action that store can do
type Store interface {
	Querier
	DeleteCamera(ctx context.Context, arg DeleteCameraParams) error
	CreateEnrollmentFileTx(ctx context.Context, arg TxEnrollmentFile) (*EnrollmentSessionFile, error)
	CreateEnrollmentFileListTx(ctx context.Context, arg TxEnrollmentFileList) error
}

// SQLStore provides all functions to execute db queries and transactions
type SQLStore struct {
	*Queries
	db *pgxpool.Pool
}

// NewStore creates a new store
func NewStore(db *pgxpool.Pool) Store {
	return &SQLStore{
		db:      db,
		Queries: New(db),
	}
}
