# Build Stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o streaming-svc ./cmd/main.go

# Run Stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/streaming-svc .
RUN mkdir -p /media
EXPOSE 8082

CMD ["./streaming-svc"]