package serializers

type CameraSerializer struct {
	Name     string `validate:"required,min=2,max=50" json:"name"`
	Type     string `validate:"required,min=2,max=50,oneof=recording entry" json:"type"`
	URL      string `validate:"required,url" json:"url"`
	OnDemand bool   `validate:"required" json:"on_demand"`
}
