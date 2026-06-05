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
	loggerConfig := zap.NewProductionConfig()
	level, err := zap.ParseAtomicLevel(cfg.LogLevel)
	if err != nil {
		panic(err.Error())
	}
	loggerConfig.Level = level
	logger, err := loggerConfig.Build()
	if err != nil {
		panic(err.Error())
	}
	server := internal.NewServer(cfg.Port, logger)
	err = server.Run()
	if err != nil {
		panic(err.Error())
	}
}
