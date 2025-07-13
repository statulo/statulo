FROM golang:1.24-alpine AS builder
WORKDIR /build

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -o scout ./cmd/scout


FROM alpine AS runner
RUN adduser -u 10000 -S scout

COPY --from=builder --chown scout /build/scout /scout

USER scout
ENTRYPOINT ["/scout"]
