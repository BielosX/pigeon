package internal

type Config struct {
	Port int16 `env:"PORT" envDefault:"8080"`
}
