<?php

namespace Database\Seeders;

use App\Models\Matakuliah;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MatakuliahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $matakuliah = [
            ['kode' => 'TK1101', 'nama' => 'Pemrograman Web II', 'sks' => 3, 'semester' => 5],
            ['kode' => 'TK1102', 'nama' => 'Struktur Data dan Algoritma', 'sks' => 3, 'semester' => 2],
            ['kode' => 'TK1103', 'nama' => 'Basis Data', 'sks' => 3, 'semester' => 2],
            ['kode' => 'TK1104', 'nama' => 'Jaringan Komputer', 'sks' => 2, 'semester' => 2],
            ['kode' => 'TK1105', 'nama' => 'Sistem Operasi', 'sks' => 3, 'semester' => 2],
        ];
        foreach ($matakuliah as $item) {
            Matakuliah::create($item);
        }
    }
}
