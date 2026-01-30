package config

import (
	"os"
)

type Config struct {
	Port          string
	MediaPath     string
	KafkaBrokers  []string
	PublicKeyPath string
}

func Load() *Config {
	return &Config{
		Port:          getEnv("PORT", "8082"),
		MediaPath:     getEnv("MEDIA_PATH", "/media"),
		KafkaBrokers:  []string{getEnv("KAFKA_ADDR", "localhost:9092")},
		PublicKeyPath: getEnv("PUBLIC_KEY_PATH", "./keys/app.pub"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
