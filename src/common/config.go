package common

import "github.com/spf13/viper"

type Config struct {
	Debug        bool   `mapstructure:"DEBUG"`
	Port         int    `mapstructure:"PORT"`
	Host         string `mapstructure:"HOST"`
	DatabaseUrl  string `mapstructure:"DATABASE_URL"`
	KafkaBootStr string `mapstructure:"KAFKA_BOOTSTRAP_SERVER"`
	MediaDir     string `mapstructure:"MEDIA_DIR"`

	// CORS
	CorsAllowOrigins string `mapstructure:"CORS_ALLOW_ORIGINS"`

	// Time Zone
	TimeZone string `mapstructure:"Time_Zone"`
}

func LoadConfig(path string) (*Config, error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	// Override configs when environment variables occure
	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		return nil, err
	}

	var config Config

	err = viper.Unmarshal(&config)

	if err != nil {
		return nil, err
	}
	return &config, nil
}
