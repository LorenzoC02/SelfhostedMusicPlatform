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

	producer := event.NewProducer(cfg.KafkaBrokers)
	defer producer.Close()

	authMiddleware, err := auth.NewAuthMiddleware(cfg.PublicKeyPath)
	if err != nil {
		log.Fatalf("Failed to initialize auth: %v", err)
	}

	streamHandler := stream.NewHandler(producer, cfg.MediaPath)

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := r.Group("/api/stream")
	api.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
	api.Use(authMiddleware.ValidateToken())
	{
		api.GET("/:filename", streamHandler.StreamTrack)
	}

	log.Printf("Streaming Service running on port %s serving files from %s", cfg.Port, cfg.MediaPath)
	r.Run(":" + cfg.Port)
}
