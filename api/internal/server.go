package internal

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"regexp"
	"strings"

	"github.com/BielosX/pigeon/internal/system_info"
	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"go.uber.org/zap"
)

type Server struct {
	rootRouter  chi.Router
	port        int16
	logger      *zap.Logger
	verifier    *oidc.IDTokenVerifier
	bearerRegex *regexp.Regexp
}

func NewServer(cfg *Config, logger *zap.Logger) (*Server, error) {
	root := chi.NewRouter()
	root.Use(middleware.Logger)
	root.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte("OK"))
	})
	keySet := oidc.NewRemoteKeySet(context.Background(), cfg.OidcKeySetUrl)
	verifier := oidc.NewVerifier(cfg.OidcIssuerUrl, keySet, &oidc.Config{
		SkipClientIDCheck: true,
	})
	systemInfoService := system_info.NewSystemInfoService(logger, cfg.HostMountPrefix)
	systemInfo := system_info.NewSystemInfoHandler(logger, systemInfoService)
	target, err := url.Parse(cfg.PrometheusUrl)
	if err != nil {
		return nil, err
	}
	proxy := &httputil.ReverseProxy{
		Rewrite: func(pr *httputil.ProxyRequest) {
			pr.SetURL(target)
			pr.Out.URL.Path = fmt.Sprintf("/api/v1/%s",
				strings.TrimPrefix(pr.In.URL.Path, "/api/v1/prometheus"))
		},
	}
	bearerRegex := regexp.MustCompile("^Bearer\\s+(.+)$")
	server := &Server{rootRouter: root, port: cfg.Port, logger: logger, verifier: verifier, bearerRegex: bearerRegex}
	root.Route("/api/v1", func(r chi.Router) {
		r.Use(middleware.AllowContentType("application/json"))
		r.Use(server.verifyToken)
		r.Mount("/system-info", systemInfo.Router)
		r.Handle("/prometheus/*", proxy)
	})
	return server, nil
}

func (s *Server) verifyToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			s.logger.Info("Received request does not contain Authorization header")
			w.WriteHeader(http.StatusForbidden)
			return
		}
		result := s.bearerRegex.FindStringSubmatch(auth)
		if len(result) != 2 {
			s.logger.Info("Received Authorization header is not of Bearer type")
			w.WriteHeader(http.StatusForbidden)
			return
		}
		_, err := s.verifier.Verify(r.Context(), result[1])
		if err != nil {
			s.logger.Info("Received token in invalid", zap.Error(err))
			w.WriteHeader(http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) Run() error {
	addr := fmt.Sprintf(":%v", s.port)
	s.logger.Info("Listening", zap.String("addr", addr))
	return http.ListenAndServe(addr, s.rootRouter)
}
