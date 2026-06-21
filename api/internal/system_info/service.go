package system_info

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/BielosX/pigeon/internal/utils"
	"go.uber.org/zap"
)

type SystemInfo struct {
	KernelVersion string
	OsRelease     string
	Uptime        time.Duration
	CpuByteOrder  string
	BoardModel    string
	BoardSerial   string
	OsName        string
}

type SystemInfoService struct {
	logger          *zap.Logger
	hostMountPrefix string
}

func NewSystemInfoService(logger *zap.Logger, prefix string) *SystemInfoService {
	return &SystemInfoService{logger: logger, hostMountPrefix: prefix}
}
func readLine(file string) (string, error) {
	f, err := os.Open(file)
	if err != nil {
		return "", err
	}
	defer func(f *os.File) {
		_ = f.Close()
	}(f)
	reader := bufio.NewReader(f)
	line, _, err := reader.ReadLine()
	if err != nil {
		return "", err
	}
	return strings.ReplaceAll(string(line), "\x00", ""), nil
}

func (s *SystemInfoService) getKernelVersion() (string, error) {
	return readLine(fmt.Sprintf("%s/proc/sys/kernel/osrelease", s.hostMountPrefix))
}

func (s *SystemInfoService) getUptime() (*time.Duration, error) {
	line, err := readLine(fmt.Sprintf("%s/proc/uptime", s.hostMountPrefix))
	if err != nil {
		s.logger.Error("Unable to fetch uptime", zap.Error(err))
		return nil, err
	}
	u, err := strconv.ParseFloat(strings.Split(line, " ")[0], 64)
	if err != nil {
		s.logger.Error("Unable to parse uptime", zap.Error(err))
		return nil, err
	}
	return new(time.Duration(u * math.Pow(1000.0, 3))), nil
}

func (s *SystemInfoService) getCpuByteOrder() (string, error) {
	return readLine(fmt.Sprintf("%s/sys/kernel/cpu_byteorder", s.hostMountPrefix))
}

func (s *SystemInfoService) getBoardModel() (string, error) {
	return readLine(fmt.Sprintf("%s/sys/firmware/devicetree/base/model", s.hostMountPrefix))
}

func (s *SystemInfoService) getBoardSerialNumber() (string, error) {
	return readLine(fmt.Sprintf("%s/sys/firmware/devicetree/base/serial-number", s.hostMountPrefix))
}

func (s *SystemInfoService) getOsRelease() (map[string]string, error) {
	result := make(map[string]string)
	f, err := os.Open(fmt.Sprintf("%s/etc/os-realease", s.hostMountPrefix))
	if err != nil {
		return nil, err
	}
	defer func(f *os.File) {
		_ = f.Close()
	}(f)
	r := bufio.NewScanner(f)
	for r.Scan() {
		text := r.Text()
		keyValue := strings.Split(text, "=")
		result[keyValue[0]] = strings.ReplaceAll(keyValue[1], "\"", "")
	}
	return result, nil
}

func (s *SystemInfoService) GetSystemInfo() (*SystemInfo, error) {
	kernelVersion, err := s.getKernelVersion()
	if err != nil {
		return nil, err
	}
	uptime, err := s.getUptime()
	if err != nil {
		return nil, err
	}
	byteOrder, err := s.getCpuByteOrder()
	if err != nil {
		return nil, err
	}
	boardModel, err := s.getBoardModel()
	if err != nil {
		return nil, err
	}
	boardSerial, err := s.getBoardSerialNumber()
	if err != nil {
		return nil, err
	}
	osRelease, err := s.getOsRelease()
	if err != nil {
		return nil, err
	}
	return &SystemInfo{
		KernelVersion: kernelVersion,
		Uptime:        *uptime,
		CpuByteOrder:  byteOrder,
		BoardModel:    boardModel,
		BoardSerial:   boardSerial,
		OsRelease:     utils.GetOrDefault(osRelease, "PRETTY_NAME", ""),
	}, nil
}
