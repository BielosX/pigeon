api-version := "0.14"
ui-version := "0.6"

[working-directory: "api"]
api-build:
    mkdir -p bin
    go build -ldflags="-s -w" -o bin/pigeon-api cmd/main.go

[working-directory: "api"]
api-image:
    podman build --no-cache -t "pigeon-api:{{api-version}}" .

api-push:
    podman push "pigeon-api:{{api-version}}" "registry.kabanos.xyz/pigeon-api:{{api-version}}"

[working-directory: "ui"]
ui-image:
    npm run build
    podman build --no-cache -t "pigeon-ui:{{ui-version}}" .

ui-push:
    podman push "pigeon-ui:{{ui-version}}" "registry.kabanos.xyz/pigeon-ui:{{ui-version}}"
