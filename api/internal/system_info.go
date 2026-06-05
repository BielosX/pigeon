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
	KernelVersion  string  `json:"KernelVersion"`
}

func (h *SystemInfoHandler) getCpuTemperature() (float32, error) {
	file, err := os.Open("/sys/class/thermal/thermal_zone0/temp")
	if err != nil {
		h.logger.Error("Failed to read thermal file", zap.Error(err))
		return 0, err
	}
	defer func(file *os.File) {
		_ = file.Close()
	}(file)
	reader := bufio.NewReader(file)
	line, _, err := reader.ReadLine()
	if err != nil {
		h.logger.Error("Failed to read temperature line", zap.Error(err))
		return 0, err
	}
	temp, err := strconv.ParseInt(strings.TrimSpace(string(line)), 10, 32)
	if err != nil {
		h.logger.Error("Failed to parse temperature", zap.Error(err))
		return 0, err
	}
	return float32(temp) / 1000.0, nil
}

func (h *SystemInfoHandler) getKernelVersion() (string, error) {
	file, err := os.Open("/proc/sys/kernel/osrelease")
	if err != nil {
		h.logger.Error("Failed to read kernel version file", zap.Error(err))
		return "", err
	}
	defer func(file *os.File) {
		_ = file.Close()
	}(file)
	reader := bufio.NewReader(file)
	line, _, err := reader.ReadLine()
	if err != nil {
		h.logger.Error("Failed to read kernel version line", zap.Error(err))
		return "", nil
	}
	return string(line), nil
}

func (h *SystemInfoHandler) getSystemInfo(w http.ResponseWriter, _ *http.Request) {
	cpuTemp, err := h.getCpuTemperature()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	kernelVersion, err := h.getKernelVersion()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response := SystemInfoResponse{CpuTemperature: cpuTemp, KernelVersion: kernelVersion}
	d, err := json.Marshal(&response)
	if err != nil {
		h.logger.Error("Failed to marshal json", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	_, _ = w.Write(d)
}
