package internal

type Config struct {
	Port            int16  `env:"PORT" envDefault:"8080"`
	LogLevel        string `env:"LOG_LEVEL" envDefault:"info"`
	HostMountPrefix string `env:"HOST_MOUNT_PREFIX" envDefault:"/host"`
	OidcIssuerUrl   string `env:"OIDC_ISSUER_URL"`
	OidcKeySetUrl   string `env:"OIDC_KEY_SET_URL"`
}
