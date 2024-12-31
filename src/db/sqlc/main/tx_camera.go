package sqlcmain

import (
	"context"
	"fmt"
	"net/http"
)

type DeleteCameraParams struct {
	Prime       string
	RTSP2WebURL string
}

func (store *SQLStore) DeleteCamera(ctx context.Context, arg DeleteCameraParams) error {

	// Apply the transaction
	err := store.execTx(ctx, func(q *Queries) error {

		err := store.DeleteCameraByPrime(ctx, arg.Prime)

		if err != nil {
			return err
		}

		// Make the POST request
		resp, err := http.Get(arg.RTSP2WebURL)
		if err != nil {
			return fmt.Errorf("error making Get request to delete on RTSP server: %v", err)
		}
		if resp.StatusCode != 200 {
			return fmt.Errorf("non-200 status code returned by get: %v", resp.StatusCode)
		}

		return nil
	})
	return err
}
