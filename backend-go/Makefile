install:
	go install ./cmd
	go mod tidy

generate:
	go run github.com/99designs/gqlgen generate

run:
	air

test:
	go test ./db ./graphql -count=1

build:
	go build cmd/main.go
