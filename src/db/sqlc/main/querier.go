// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlcmain

import (
	"context"
)

type Querier interface {
	CreateBulkEnrollmentFiles(ctx context.Context, arg []CreateBulkEnrollmentFilesParams) (int64, error)
	CreateCamera(ctx context.Context, prime string, name string, type_ string, url string, onDemand bool) (Camera, error)
	CreateEnrollmentFile(ctx context.Context, prime string, sessionID int64, path string) (EnrollmentSessionFile, error)
	CreateEnrollmentSession(ctx context.Context, prime string, type_ string, status string, personID int64) (EnrollmentSession, error)
	CreatePerson(ctx context.Context, prime string, firstName string, lastName string) (Person, error)
	DeleteCameraByPrime(ctx context.Context, prime string) error
	GetCameraByPrime(ctx context.Context, prime string) (Camera, error)
	GetEnrollmentSessionByPrime(ctx context.Context, prime string) (EnrollmentSession, error)
	GetEnrollmentVideo(ctx context.Context, sessionID int64) (EnrollmentSessionFile, error)
	GetEventByPrime(ctx context.Context, prime string) (GetEventByPrimeRow, error)
	GetEventsList(ctx context.Context, limit int32, offset int32) ([]GetEventsListRow, error)
	GetPersonByPrime(ctx context.Context, prime string) (Person, error)
	ListCameras(ctx context.Context, limit int32, offset int32) ([]Camera, error)
	ListEnrollmentImage(ctx context.Context, sessionID int64) ([]EnrollmentSessionFile, error)
	ListEnrollmentSession(ctx context.Context, limit int32, offset int32) ([]EnrollmentSession, error)
	ListEnrollmentSessionByPerson(ctx context.Context, personID int64, limit int32, offset int32) ([]EnrollmentSession, error)
	ListFace(ctx context.Context, limit int32, offset int32) ([]Face, error)
	ListPerson(ctx context.Context, limit int32, offset int32) ([]Person, error)
	UpdateEnrollmentStatusByID(ctx context.Context, iD int64, status string) error
}

var _ Querier = (*Queries)(nil)
