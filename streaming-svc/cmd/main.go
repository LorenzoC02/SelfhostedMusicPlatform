package main

import (
	"log"
	"streaming-svc/internal/auth"
	"streaming-svc/internal/config"
	"streaming-svc/internal/event"
	"streaming-svc/internal/stream"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	// 1. Initialize Kafka
	producer := event.NewProducer(cfg.KafkaBrokers)
	defer producer.Close()

	// 2. Initialize Auth Middleware
	authMiddleware, err := auth.NewAuthMiddleware(cfg.PublicKeyPath)
	if err != nil {
		log.Fatalf("Failed to initialize auth: %v", err)
	}

	// 3. Initialize Handler
	streamHandler := stream.NewHandler(producer, cfg.MediaPath)

	// 4. Setup Router
	r := gin.Default()

	// Public Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Protected Streaming Routes
	api := r.Group("/api/stream")
	api.Use(authMiddleware.ValidateToken())
	{
		// GET /api/stream/song.mp3
		// GET /api/stream/song.flac
		api.GET("/:filename", streamHandler.StreamTrack)
	}

	log.Printf("Streaming Service running on port %s serving files from %s", cfg.Port, cfg.MediaPath)
	r.Run(":" + cfg.Port)
}
