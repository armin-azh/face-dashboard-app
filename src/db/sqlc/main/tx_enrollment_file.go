package sqlcmain

import (
	"context"
	"fmt"
)

type TxEnrollmentFile struct {
	Prime      string
	SessionId  int64
	Path       string
	NextStatus string
}

type TxEnrollmentFileList struct {
	SessionId  int64
	Files      []CreateBulkEnrollmentFilesParams
	NextStatus string
}

func (store *SQLStore) CreateEnrollmentFileTx(ctx context.Context, arg TxEnrollmentFile) (*EnrollmentSessionFile, error) {

	var file *EnrollmentSessionFile
	err := store.execTx(ctx, func(q *Queries) error {
		newFile, err := store.CreateEnrollmentFile(ctx, arg.Prime, arg.SessionId, arg.Path)
		if err != nil {
			return fmt.Errorf("CreateEnrollmentFileTx: %w", err)
		}

		err = store.UpdateEnrollmentStatusByID(ctx, arg.SessionId, arg.NextStatus)
		if err != nil {
			return fmt.Errorf("UpdateEnrollmentStatusByID: %w", err)
		}

		file = &newFile
		return nil
	})

	return file, err
}

func (store *SQLStore) CreateEnrollmentFileListTx(ctx context.Context, arg TxEnrollmentFileList) error {

	err := store.execTx(ctx, func(q *Queries) error {
		_, err := store.CreateBulkEnrollmentFiles(ctx, arg.Files)
		if err != nil {
			return fmt.Errorf("CreateEnrollmentFileTx: %w", err)
		}

		err = store.UpdateEnrollmentStatusByID(ctx, arg.SessionId, arg.NextStatus)
		if err != nil {
			return fmt.Errorf("UpdateEnrollmentStatusByID: %w", err)
		}

		return nil
	})

	return err
}
