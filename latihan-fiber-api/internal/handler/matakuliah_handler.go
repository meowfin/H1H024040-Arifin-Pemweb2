package handler

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"

	"latihan-fiber-api/internal/model"
	"latihan-fiber-api/internal/repository"
)

func DaftarMatakuliah(c fiber.Ctx) error {
	halaman, _ := strconv.Atoi(c.Query("halaman", "1"))
	perHalaman, _ := strconv.Atoi(c.Query("per_halaman", "10"))
	semester, _ := strconv.Atoi(c.Query("semester", "0"))

	if halaman < 1 {
		halaman = 1
	}
	if perHalaman < 1 || perHalaman > 100 {
		perHalaman = 10
	}

	filter := repository.FilterMatakuliah{
		Cari:       c.Query("cari", ""),
		Semester:   semester,
		Halaman:    halaman,
		PerHalaman: perHalaman,
	}

	daftar, total, err := repository.AmbilMatakuliah(filter)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil data matakuliah")
	}

	totalHalaman := int(total) / perHalaman
	if int(total)%perHalaman != 0 {
		totalHalaman++
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"data":   daftar,
		"meta": fiber.Map{
			"halaman":       halaman,
			"per_halaman":   perHalaman,
			"total":         total,
			"total_halaman": totalHalaman,
		},
	})
}

func DetailMatakuliah(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ID harus berupa angka")
	}

	mk, err := repository.AmbilMatakuliahPerId(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Matakuliah tidak ditemukan")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil data")
	}

	return c.JSON(fiber.Map{"sukses": true, "data": mk})
}

func BuatMatakuliah(c fiber.Ctx) error {
	var req PermintaanMatakuliah
	if err := c.Bind().Body(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Format body tidak valid")
	}

	wajib := true
	if req.Wajib != nil {
		wajib = *req.Wajib
	}

	mk := model.Matakuliah{
		ProgramStudiID: req.ProgramStudiID,
		Kode:           req.Kode,
		Nama:           req.Nama,
		Sks:            req.Sks,
		Semester:       req.Semester,
		Wajib:          wajib,
	}

	if err := repository.SimpanMatakuliah(&mk); err != nil {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "Gagal menyimpan matakuliah, periksa keunikan kode")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"sukses": true,
		"pesan":  "Matakuliah berhasil dibuat",
		"data":   mk,
	})
}

func PerbaruiMatakuliah(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ID harus berupa angka")
	}

	mk, err := repository.AmbilMatakuliahPerId(uint(id))
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Matakuliah tidak ditemukan")
	}

	var req PermintaanMatakuliah
	if err := c.Bind().Body(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Format body tidak valid")
	}

	if req.ProgramStudiID > 0 {
		mk.ProgramStudiID = req.ProgramStudiID
	}
	if req.Kode != "" {
		mk.Kode = req.Kode
	}
	if req.Nama != "" {
		mk.Nama = req.Nama
	}
	if req.Sks > 0 {
		mk.Sks = req.Sks
	}
	if req.Semester > 0 {
		mk.Semester = req.Semester
	}
	if req.Wajib != nil {
		mk.Wajib = *req.Wajib
	}

	if err := repository.PerbaruiMatakuliah(&mk); err != nil {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "Gagal memperbarui matakuliah")
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"pesan":  "Matakuliah berhasil diperbarui",
		"data":   mk,
	})
}

func HapusMatakuliah(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ID harus berupa angka")
	}

	mk, err := repository.AmbilMatakuliahPerId(uint(id))
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Matakuliah tidak ditemukan")
	}

	if err := repository.HapusMatakuliah(&mk); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal menghapus matakuliah")
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"pesan":  "Matakuliah berhasil dihapus",
	})
}
