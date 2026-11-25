const BACKEND_AKTIF = (import.meta.env.VITE_BACKEND_AKTIF || "laravel").toLowerCase();

export const konfigurasiBackend = {
  nama: BACKEND_AKTIF,
  baseURL: BACKEND_AKTIF === "fiber" ? import.meta.env.VITE_API_FIBER : import.meta.env.VITE_API_LARAVEL,
};

export function buatPayloadLogin(email, kataSandi) {
  if (BACKEND_AKTIF === "fiber") {
    return { email, kata_sandi: kataSandi };
  }
  return { email, password: kataSandi };
}

export function buatParameterDaftar({ halaman, cari, perHalaman = 10 }) {
  if (BACKEND_AKTIF === "fiber") {
    return { halaman, cari, per_halaman: perHalaman };
  }
  return { page: halaman, cari, per_halaman: perHalaman };
}

export function normalisasiMeta(meta) {
  if (!meta) return null;

  return {
    halamanSaatIni: meta.current_page ?? meta.halaman ?? 1,
    totalHalaman: meta.last_page ?? meta.total_halaman ?? 1,
    totalData: meta.total ?? meta.total_data ?? 0,
  };
}

export function ekstrakPesanGalat(galat, pesanBawaan = "Terjadi kesalahan pada server") {
  const data = galat?.response?.data;
  if (!data) return "Tidak dapat menghubungi server";
  return data.pesan || data.message || data.error || pesanBawaan;
}

export function ekstrakGalatValidasi(galat) {
  const data = galat?.response?.data;
  if (!data) return {};

  // Format Laravel: { errors: { nim: ["NIM sudah digunakan"] } }
  if (data.errors && typeof data.errors === "object") {
    const hasil = {};
    for (const [kolom, daftarPesan] of Object.entries(data.errors)) {
      hasil[kolom] = Array.isArray(daftarPesan) ? daftarPesan[0] : String(daftarPesan);
    }
    return hasil;
  }

  // Format Fiber: { galat: { nim: "..." } } atau { detail: [{ field/kolom, pesan/message }] }
  if (data.galat && typeof data.galat === "object" && !Array.isArray(data.galat)) {
    return data.galat;
  }

  if (Array.isArray(data.detail)) {
    const hasil = {};
    for (const item of data.detail) {
      const kunci = (item.field || item.kolom || "").toLowerCase();
      if (kunci) hasil[kunci] = item.pesan || item.message || "Tidak valid";
    }
    return hasil;
  }

  return {};
}
