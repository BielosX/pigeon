package internal

import (
	"bufio"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

type SystemInfoHandler struct {
	logger *zap.Logger
	Router chi.Router
}

func NewSystemInfoHandler(logger *zap.Logger) *SystemInfoHandler {
	router := chi.NewRouter()
	handler := &SystemInfoHandler{Router: router, logger: logger}
	router.Get("/", handler.getSystemInfo)
	return handler
}

type SystemInfoResponse struct {
	CpuTemperature float32 `json:"CpuTemperature"`
}

func (h *SystemInfoHandler) getSystemInfo(w http.ResponseWriter, _ *http.Request) {
	file, err := os.Open("/sys/class/thermal/thermal_zone0/temp")
	if err != nil {
		h.logger.Error("Failed to read thermal file", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer func(file *os.File) {
		_ = file.Close()
	}(file)
	reader := bufio.NewReader(file)
	line, _, err := reader.ReadLine()
	if err != nil {
		h.logger.Error("Failed to read temperature line", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	temp, err := strconv.ParseInt(strings.TrimSpace(string(line)), 10, 32)
	if err != nil {
		h.logger.Error("Failed to parse temperature", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response := SystemInfoResponse{CpuTemperature: float32(temp) / 1000.0}
	d, err := json.Marshal(&response)
	if err != nil {
		h.logger.Error("Failed to marshal json", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	_, _ = w.Write(d)
}
