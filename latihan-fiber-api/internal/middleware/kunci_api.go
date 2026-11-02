package middleware

import (
	"os"

	"github.com/gofiber/fiber/v3"
)

func KunciApi() fiber.Handler {
	return func(c fiber.Ctx) error {
		kunciPengguna := c.Get("X-Api-Key")
		kunciServer := os.Getenv("API_KEY")

		if kunciServer == "" || kunciPengguna != kunciServer {
			return fiber.NewError(fiber.StatusUnauthorized, "Akses ditolak: X-Api-Key tidak valid")
		}

		return c.Next()
	}
}
