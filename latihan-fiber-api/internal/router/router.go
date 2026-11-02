package router

import (
	"latihan-fiber-api/internal/handler"
	"latihan-fiber-api/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func Daftarkan(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/status", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"sukses": true,
			"pesan":  "API Fiber aktif",
		})
	})

	// Melindungi grup rute mahasiswa dengan middleware KunciApi
	mahasiswa := api.Group("/mahasiswa", middleware.KunciApi())
	mahasiswa.Get("/", handler.DaftarMahasiswa)
	mahasiswa.Get("/nim/:nim", handler.DetailMahasiswaNim)
	mahasiswa.Get("/:id", handler.DetailMahasiswa)
}