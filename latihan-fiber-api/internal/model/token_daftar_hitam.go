package model

import "time"

type TokenDaftarHitam struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Token           string    `gorm:"size:512;uniqueIndex" json:"token"`
	KedaluwarsaPada time.Time `json:"kedaluwarsa_pada"`
	CreatedAt       time.Time `json:"dibuat_pada"`
}
