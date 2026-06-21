package internal

import (
	"fmt"
	"net/http"

	"github.com/BielosX/pigeon/internal/system_info"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"go.uber.org/zap"
)

type Server struct {
	rootRouter chi.Router
	port       int16
	logger     *zap.Logger
}

func NewServer(port int16, hostMountPrefix string, logger *zap.Logger) *Server {
	root := chi.NewRouter()
	root.Use(middleware.Logger)
	root.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte("OK"))
	})
	systemInfoService := system_info.NewSystemInfoService(logger, hostMountPrefix)
	systemInfo := system_info.NewSystemInfoHandler(logger, systemInfoService)
	root.Route("/api/v1", func(r chi.Router) {
		r.Use(middleware.AllowContentType("application/json"))
		r.Mount("/system-info", systemInfo.Router)
	})
	return &Server{rootRouter: root, port: port, logger: logger}
}

func (s *Server) Run() error {
	addr := fmt.Sprintf(":%v", s.port)
	s.logger.Info("Listening", zap.String("addr", addr))
	return http.ListenAndServe(addr, s.rootRouter)
}
