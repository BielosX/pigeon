package main

import (
	"github.com/BielosX/pigeon/internal"
	"github.com/caarlos0/env/v11"
	"go.uber.org/zap"
)

func main() {
	var cfg internal.Config
	err := env.Parse(&cfg)
	if err != nil {
		panic(err.Error())
	}
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err.Error())
	}
	server := internal.NewServer(cfg.Port, logger)
	err = server.Run()
	if err != nil {
		panic(err.Error())
	}
}
