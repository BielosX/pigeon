package internal

type Config struct {
	Port            int16  `env:"PORT" envDefault:"8080"`
	LogLevel        string `env:"LOG_LEVEL" envDefault:"info"`
	HostMountPrefix string `env:"HOST_MOUNT_PREFIX" envDefault:"/host"`
}
