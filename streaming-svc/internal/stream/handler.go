package stream

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"streaming-svc/internal/event"

	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Kafka     *event.Producer
	MediaPath string
}

func NewHandler(k *event.Producer, mediaPath string) *Handler {
	return &Handler{Kafka: k, MediaPath: mediaPath}
}

func (h *Handler) StreamTrack(c *gin.Context) {
	trackFilename := c.Param("filename")
	username := c.GetString("user")

	// 1. Path Sanitization (prevent ../../etc/passwd attacks)
	cleanPath := filepath.Clean(trackFilename)
	if strings.Contains(cleanPath, "..") || strings.HasPrefix(cleanPath, "/") || strings.Contains(cleanPath, "\\") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filename"})
		return
	}

	fullPath := filepath.Join(h.MediaPath, cleanPath)

	// 2. Check if file exists
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Track not found"})
		return
	}

	// 3. Detect Content-Type (Magic Bytes)
	// We scan the file header to determine if it is flac, wav, or mp3.
	// This is more secure/reliable than trusting the file extension.
	mime, err := mimetype.DetectFile(fullPath)
	if err != nil {
		// Fallback if read fails, though ServeFile handles it too
		c.Status(http.StatusInternalServerError)
		return
	}

	// 4. Set Headers
	// http.ServeFile will set Content-Length and Accept-Ranges automatically.
	// We override Content-Type to ensure browsers treat it as audio.
	c.Header("Content-Type", mime.String())

	// Optional: Cache-Control to tell browser/OS to cache this locally
	c.Header("Cache-Control", "private, max-age=31536000") // Cache for 1 year

	// 5. Log Event (Only on start of stream)
	// 'Range' header missing usually implies starting from 0
	rangeHeader := c.GetHeader("Range")
	if rangeHeader == "" || strings.HasPrefix(rangeHeader, "bytes=0-") {
		h.Kafka.LogPlay(username, trackFilename)
	}

	// 6. Serve File
	// This Go standard library function handles:
	// - HTTP 206 Partial Content (Seeking)
	// - Range parsing
	// - Optimized OS-level sendfile syscalls
	http.ServeFile(c.Writer, c.Request, fullPath)
}
