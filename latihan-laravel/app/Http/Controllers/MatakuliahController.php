<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MatakuliahController extends Controller
{
    // Data array statis minimal 5 matakuliah
    private $matakuliah = [
        ['kode' => 'TK1101', 'nama' => 'Pemrograman Web II', 'sks' => 3],
        ['kode' => 'TK1102', 'nama' => 'Struktur Data dan Algoritma', 'sks' => 3],
        ['kode' => 'TK1103', 'nama' => 'Basis Data', 'sks' => 3],
        ['kode' => 'TK1104', 'nama' => 'Jaringan Komputer', 'sks' => 2],
        ['kode' => 'TK1105', 'nama' => 'Sistem Operasi', 'sks' => 3],
    ];

    public function index(Request $request)
    {
        $keyword = $request->query('q', '');

        // Fitur pencarian sederhana berdasarkan nama atau kode
        $filtered = array_filter($this->matakuliah, function ($item) use ($keyword) {
            return empty($keyword) ||
                stripos($item['nama'], $keyword) !== false ||
                stripos($item['kode'], $keyword) !== false;
        });

        return view('matakuliah.index', [
            'daftarMatakuliah' => $filtered,
            'keyword' => $keyword
        ]);
    }

    public function show(string $kode)
    {
        $matakuliah = collect($this->matakuliah)->firstWhere('kode', $kode);

        if (!$matakuliah) {
            abort(404, 'Matakuliah tidak ditemukan');
        }

        return view('matakuliah.show', ['matakuliah' => $matakuliah]);
    }
}
