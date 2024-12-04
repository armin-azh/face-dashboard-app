// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlcmain

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Camera struct {
	ID        int64              `json:"id"`
	Prime     string             `json:"prime"`
	Name      string             `json:"name"`
	Type      string             `json:"type"`
	Url       string             `json:"url"`
	OnDemand  bool               `json:"on_demand"`
	CreatedAt pgtype.Timestamptz `json:"created_at"`
}

type Enrollment struct {
	ID        int64              `json:"id"`
	Prime     string             `json:"prime"`
	SessionID int64              `json:"session_id"`
	FaceID    *int64             `json:"face_id"`
	CreatedAt pgtype.Timestamptz `json:"created_at"`
}

type EnrollmentSession struct {
	ID        int64              `json:"id"`
	Prime     string             `json:"prime"`
	Type      string             `json:"type"`
	Status    string             `json:"status"`
	PersonID  int64              `json:"person_id"`
	CreatedAt pgtype.Timestamptz `json:"created_at"`
}

type Event struct {
	ID        int64              `json:"id"`
	Prime     string             `json:"prime"`
	PersonID  *int64             `json:"person_id"`
	CameraID  *int64             `json:"camera_id"`
	FaceID    *int64             `json:"face_id"`
	HappendAt pgtype.Timestamptz `json:"happend_at"`
	CreatedAt pgtype.Timestamptz `json:"created_at"`
}

type Face struct {
	ID        int64     `json:"id"`
	Prime     string    `json:"prime"`
	Image     string    `json:"image"`
	Thumbnail string    `json:"thumbnail"`
	Vector    []float64 `json:"vector"`
	Score     float64   `json:"score"`
	Indexed   bool      `json:"indexed"`
}

type Person struct {
	ID        int64              `json:"id"`
	Prime     string             `json:"prime"`
	FirstName string             `json:"first_name"`
	LastName  string             `json:"last_name"`
	CreatedAt pgtype.Timestamptz `json:"created_at"`
}
