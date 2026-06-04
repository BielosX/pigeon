api-version := "0.5"
ui-version := "0.4"

[working-directory: "api"]
api-build:
    mkdir -p bin
    go build -ldflags="-s -w" -o bin/pigeon-api cmd/main.go

[working-directory: "api"]
api-image:
    podman build -t "pigeon-api:{{api-version}}" .

api-push:
    podman push "pigeon-api:{{api-version}}" "registry.home.arpa/pigeon-api:{{api-version}}"

[working-directory: "ui"]
ui-image:
    npm run build
    podman build -t "pigeon-ui:{{ui-version}}" .

ui-push:
    podman push "pigeon-ui:{{ui-version}}" "registry.home.arpa/pigeon-ui:{{ui-version}}"
