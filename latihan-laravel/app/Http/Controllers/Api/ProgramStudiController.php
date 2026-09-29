<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MahasiswaResource;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;

class ProgramStudiController extends Controller
{
    public function mahasiswa(Request $request, string $id)
    {
        $programStudi = ProgramStudi::findOrFail($id);

        $kueri = $programStudi->mahasiswas();

        // Penerapan pencarian jika ada
        if ($request->filled('cari')) {
            $katakunci = $request->query('cari');
            $kueri->where(function ($sub) use ($katakunci) {
                $sub->where('nama', 'like', '%' . $katakunci . '%')
                    ->orWhere('nim', 'like', '%' . $katakunci . '%');
            });
        }

        $perHalaman = min($request->integer('per_halaman', 10), 100);

        return MahasiswaResource::collection($kueri->paginate($perHalaman));
    }
}
