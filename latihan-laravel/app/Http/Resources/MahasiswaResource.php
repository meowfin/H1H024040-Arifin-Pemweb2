<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MahasiswaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'nim' => $this->nim,
            'nama' => $this->nama,
            'email' => $this->email,
            'angkatan' => $this->angkatan,
            'ipk' => $this->ipk !== null ? (float) $this->ipk : null,
            'aktif' => $this->aktif,
            'program_studi' => $this->whenLoaded('programStudi', function () {
                return [
                    'id' => $this->programStudi->id,
                    'kode' => $this->programStudi->kode,
                    'nama' => $this->programStudi->nama,
                ];
            }),
            'dibuat_pada' => $this->created_at?->toIso8601String(),
        ];

        // Memfilter atribut respons jika parameter fields dikirim oleh klien
        if ($request->filled('fields')) {
            $fields = array_map('trim', explode(',', $request->query('fields')));
            return array_intersect_key($data, array_flip($fields));
        }

        return $data;
    }
}
