api-version := "0.1"

[working-directory: "api"]
api-build:
    mkdir -p bin
    go build -ldflags="-s -w" -o bin/pigeon-api cmd/main.go

[working-directory: "api"]
api-image:
    podman build -t "pigeon-api:{{api-version}}" .

api-push:
    podman push "pigeon-api:{{api-version}}" "registry.home.arpa/pigeon-api:{{api-version}}"