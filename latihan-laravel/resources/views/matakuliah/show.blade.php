@extends('layouts.app')

@section('judul', 'Detail Matakuliah')

@section('konten')
<h1 class="h3 mb-4">Detail Matakuliah</h1>

<div class="card">
    <div class="card-body">
        <h5 class="card-title">{{ $matakuliah['nama'] }}</h5>
        <p class="card-text mb-2"><strong>Kode:</strong> {{ $matakuliah['kode'] }}</p>
        <p class="card-text mb-3"><strong>Jumlah SKS:</strong> <x-badge-sks :sks="$matakuliah['sks']" /></p>
        <a href="{{ route('matakuliah.index') }}" class="btn btn-secondary">Kembali</a>
    </div>
</div>
@endsection