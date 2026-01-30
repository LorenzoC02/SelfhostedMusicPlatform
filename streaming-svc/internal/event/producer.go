package event

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

type Producer struct {
	writer *kafka.Writer
}

type TrackPlayedEvent struct {
	Username  string    `json:"username"`
	TrackID   string    `json:"track_id"`
	Timestamp time.Time `json:"timestamp"`
}

func NewProducer(brokers []string) *Producer {
	w := &kafka.Writer{
		Addr:     kafka.TCP(brokers...),
		Topic:    "track-played",
		Balancer: &kafka.LeastBytes{},
	}
	return &Producer{writer: w}
}

func (p *Producer) LogPlay(username, trackID string) {
	event := TrackPlayedEvent{
		Username:  username,
		TrackID:   trackID,
		Timestamp: time.Now(),
	}

	msgBytes, _ := json.Marshal(event)

	// Fire and forget
	go func() {
		err := p.writer.WriteMessages(context.Background(),
			kafka.Message{
				Key:   []byte(username),
				Value: msgBytes,
			},
		)
		if err != nil {
			log.Printf("Failed to write to kafka: %v", err)
		}
	}()
}

func (p *Producer) Close() {
	p.writer.Close()
}
