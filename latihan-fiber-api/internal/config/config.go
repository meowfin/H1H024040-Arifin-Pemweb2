package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Konfigurasi struct {
	AppName     string
	AppPort     string
	DbHost      string
	DbPort      string
	DbNama      string
	DbUser      string
	DbSandi     string
	JwtSecret   string
	JwtTtlMenit int
}

func Muat() Konfigurasi {
	_ = godotenv.Load()

	ttl, err := strconv.Atoi(ambil("JWT_TTL_MENIT", "120"))
	if err != nil {
		ttl = 120
	}

	return Konfigurasi{
		AppName:     ambil("APP_NAME", "latihan-fiber-api"),
		AppPort:     ambil("APP_PORT", "3000"),
		DbHost:      ambil("DB_HOST", "127.0.0.1"),
		DbPort:      ambil("DB_PORT", "3306"),
		DbNama:      ambil("DB_NAME", ambil("DB_NAMA", "akademik")),
		DbUser:      ambil("DB_USER", ambil("DB_USER", "root")),
		DbSandi:     ambil("DB_PASS", ambil("DB_SANDI", "")),
		JwtSecret:   ambil("JWT_SECRET", "rahasia-bawaan"),
		JwtTtlMenit: ttl,
	}
}

func ambil(kunci string, bawaan string) string {
	nilai := os.Getenv(kunci)
	if nilai == "" {
		return bawaan
	}
	return nilai
}
