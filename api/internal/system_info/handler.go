package system_info

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

type SystemInfoHandler struct {
	logger  *zap.Logger
	service *SystemInfoService
	Router  chi.Router
}

func NewSystemInfoHandler(logger *zap.Logger, service *SystemInfoService) *SystemInfoHandler {
	router := chi.NewRouter()
	handler := &SystemInfoHandler{Router: router, logger: logger, service: service}
	router.Get("/", handler.getSystemInfo)
	return handler
}

type SystemInfoResponse struct {
	KernelVersion string `json:"kernelVersion"`
	Uptime        string `json:"uptime"`
	CpuByteOrder  string `json:"cpuByteOrder"`
	BoardModel    string `json:"boardModel"`
	BoardSerial   string `json:"boardSerial"`
}

func (h *SystemInfoHandler) getSystemInfo(w http.ResponseWriter, _ *http.Request) {
	info, err := h.service.GetSystemInfo()
	if err != nil {
		h.logger.Error("Failed to get system info", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response := SystemInfoResponse{
		KernelVersion: info.KernelVersion,
		Uptime:        info.Uptime.String(),
		CpuByteOrder:  info.CpuByteOrder,
		BoardModel:    info.BoardModel,
		BoardSerial:   info.BoardSerial,
	}
	r, err := json.Marshal(response)
	if err != nil {
		h.logger.Error("Failed to marshal SystemInfoResponse", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	_, _ = w.Write(r)
}
