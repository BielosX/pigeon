package internal

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"go.uber.org/zap"
)

type Server struct {
	rootRouter chi.Router
	port       int16
	logger     *zap.Logger
}

type CpuResponse struct {
	Temperature float32 `json:"temperature"`
}

func NewServer(port int16, logger *zap.Logger) *Server {
	root := chi.NewRouter()
	root.Use(middleware.Logger)
	root.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte("OK"))
	})
	root.Route("/api/v1", func(r chi.Router) {
		r.Get("/cpu", func(w http.ResponseWriter, _ *http.Request) {
			data, err := os.ReadFile("/sys/class/thermal/thermal_zone0/temp")
			if err != nil {
				logger.Error("Failed to read thermal file", zap.Error(err))
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			temp, err := strconv.ParseInt(string(data), 10, 32)
			if err != nil {
				logger.Error("Failed to parse temperature", zap.Error(err))
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			response := CpuResponse{Temperature: float32(temp) / 1000.0}
			d, err := json.Marshal(&response)
			if err != nil {
				logger.Error("Failed to marshal json", zap.Error(err))
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			_, _ = w.Write(d)
		})
	})
	return &Server{rootRouter: root, port: port, logger: logger}
}

func (s *Server) Run() error {
	addr := fmt.Sprintf(":%v", s.port)
	s.logger.Info("Listening", zap.String("addr", addr))
	return http.ListenAndServe(addr, s.rootRouter)
}
