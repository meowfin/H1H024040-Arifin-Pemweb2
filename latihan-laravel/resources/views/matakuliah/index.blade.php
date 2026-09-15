@extends('layouts.app')

@section('judul', 'Daftar Matakuliah')

@section('konten')
<div class="row mb-4">
    <div class="col-md-6">
        <h1 class="h3">Daftar Matakuliah</h1>
    </div>
    <div class="col-md-6">
        <form action="{{ route('matakuliah.index') }}" method="GET" class="d-flex">
            <input type="text" name="q" class="form-control me-2" placeholder="Cari kode/nama..." value="{{ $keyword ?? '' }}">
            <button type="submit" class="btn btn-outline-primary">Cari</button>
        </form>
    </div>
</div>

<table class="table table-bordered bg-white">
    <thead>
        <tr>
            <th>Kode</th>
            <th>Nama Matakuliah</th>
            <th>SKS</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($daftarMatakuliah as $mk)
        <tr>
            <td>{{ $mk['kode'] }}</td>
            <td>{{ $mk['nama'] }}</td>
            <td>
                <x-badge-sks :sks="$mk['sks']" />
            </td>
            <td>
                <a href="{{ route('matakuliah.show', $mk['kode']) }}" class="btn btn-sm btn-primary">Detail</a>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="4" class="text-center">Data matakuliah tidak ditemukan.</td>
        </tr>
        @endforelse
    </tbody>
</table>
@endsection