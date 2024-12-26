package serializers

type EnrollmentSerializer struct {
	Type string `validate:"required,min=2,max=50,oneof=video image recording" json:"type"`
}

type EnrollmentPrimeSerializer struct {
	Primes []string `validate:"required" json:"primes"`
}
