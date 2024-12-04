package serializers

type EnrollmentSerializer struct {
	Type string `validate:"required,min=2,max=50,oneof=video image recording" json:"type"`
}
