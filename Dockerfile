FROM golang:1.22 AS builder

WORKDIR /app
# Install required dependencies
RUN apt-get update && apt-get install -y --no-install-recommends librdkafka-dev curl \
    && rm -rf /var/lib/apt/lists/* \

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy application files
COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -a -ldflags '-extldflags "-static"' -o server src/server.go
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.17.0/migrate.linux-amd64.tar.gz | tar xvz

FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/migrate .

COPY app.env .

COPY src/db/migrations ./migrations

COPY wait-for .

RUN chmod +x /app/wait-for

EXPOSE 8080

CMD ["/app/server"]



