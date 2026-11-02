package handler

import (
	"sort"
	"strconv"
	"strings"

	"latihan-fiber-api/internal/model"

	"github.com/gofiber/fiber/v3"
)

// Tugas 2: Mendukung filter angkatan dan pengurutan berdasarkan nama atau ipk
func DaftarMahasiswa(c fiber.Ctx) error {
	angkatan := c.Query("angkatan", "")
	urut := c.Query("urut", "")

	hasil := make([]model.Mahasiswa, 0, len(model.Daftar))

	if angkatan == "" {
		hasil = append(hasil, model.Daftar...)
	} else {
		nilaiAngkatan, err := strconv.Atoi(angkatan)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Parameter angkatan harus berupa angka")
		}

		for i := 0; i < len(model.Daftar); i++ {
			if model.Daftar[i].Angkatan == nilaiAngkatan {
				hasil = append(hasil, model.Daftar[i])
			}
		}
	}

	if urut != "" {
		switch urut {
		case "nama":
			sort.Slice(hasil, func(i, j int) bool {
				return hasil[i].Nama < hasil[j].Nama
			})
		case "ipk":
			sort.Slice(hasil, func(i, j int) bool {
				return hasil[i].Ipk > hasil[j].Ipk
			})
		default:
			return fiber.NewError(fiber.StatusBadRequest, "Parameter urut hanya boleh bernilai nama atau ipk")
		}
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"data":   hasil,
	})
}

func DetailMahasiswa(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ID harus berupa angka")
	}

	for i := 0; i < len(model.Daftar); i++ {
		if model.Daftar[i].ID == id {
			return c.JSON(fiber.Map{
				"sukses": true,
				"data":   model.Daftar[i],
			})
		}
	}

	return fiber.NewError(fiber.StatusNotFound, "Mahasiswa tidak ditemukan")
}

// Tugas 1: Mencari data mahasiswa berdasarkan NIM
func DetailMahasiswaNim(c fiber.Ctx) error {
	nim := c.Params("nim")

	for i := 0; i < len(model.Daftar); i++ {
		if strings.EqualFold(model.Daftar[i].Nim, nim) {
			return c.JSON(fiber.Map{
				"sukses": true,
				"data":   model.Daftar[i],
			})
		}
	}

	return fiber.NewError(fiber.StatusNotFound, "Mahasiswa dengan NIM tersebut tidak ditemukan")
}
