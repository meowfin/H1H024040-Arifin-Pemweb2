@extends('layouts.app')
@section('konten')
<h3>Detail Mahasiswa: {{ $mahasiswa->nama }}</h3>
<p>NIM: {{ $mahasiswa->nim }}</p>

<h4>Daftar Matakuliah</h4>
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Kode</th>
            <th>Mata Kuliah</th>
            <th>SKS</th>
            <th>Nilai</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($mahasiswa->matakuliahs as $mk)
        <tr>
            <td>{{ $mk->kode }}</td>
            <td>{{ $mk->nama }}</td>
            <td>{{ $mk->sks }}</td>
            <td>{{ $mk->pivot->nilai }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection