import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ambilDaftarMahasiswa, hapusMahasiswa } from "../api/layananMahasiswa";
import { buatParameterDaftar, ekstrakPesanGalat, konfigurasiBackend, normalisasiMeta } from "../api/adaptorBackend";

export default function DaftarMahasiswa() {
  const [daftar, setDaftar] = useState([]);
  const [meta, setMeta] = useState(null);
  const [halaman, setHalaman] = useState(1);
  const [cari, setCari] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [sedangMenghapusId, setSedangMenghapusId] = useState(null);
  const [pesanGalat, setPesanGalat] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");
  const [pemicuMuatUlang, setPemicuMuatUlang] = useState(0);

  useEffect(() => {
    let dibatalkan = false;

    async function muatData() {
      setSedangMemuat(true);
      setPesanGalat("");

      try {
        const parameter = buatParameterDaftar({
          halaman,
          cari,
          perHalaman: 10,
        });
        const hasil = await ambilDaftarMahasiswa(parameter);

        if (dibatalkan === false) {
          setDaftar(hasil.data || []);
          setMeta(normalisasiMeta(hasil.meta));
        }
      } catch (galat) {
        if (dibatalkan === false) {
          setPesanGalat(ekstrakPesanGalat(galat, "Gagal memuat data mahasiswa"));
        }
      } finally {
        if (dibatalkan === false) {
          setSedangMemuat(false);
        }
      }
    }

    const penunda = setTimeout(muatData, 400);

    return () => {
      dibatalkan = true;
      clearTimeout(penunda);
    };
  }, [halaman, cari, pemicuMuatUlang]);

  async function tanganiHapus(mahasiswa) {
    const dikonfirmasi = window.confirm(`Apakah Anda yakin ingin menghapus mahasiswa "${mahasiswa.nama}" (${mahasiswa.nim})?`);

    if (!dikonfirmasi) return;

    setPesanGalat("");
    setPesanSukses("");
    setSedangMenghapusId(mahasiswa.id);

    try {
      await hapusMahasiswa(mahasiswa.id);
      setPesanSukses(`Data mahasiswa ${mahasiswa.nama} berhasil dihapus.`);

      // Jika data terakhir di halaman > 1 dihapus, mundur ke halaman sebelumnya
      if (daftar.length === 1 && halaman > 1) {
        setHalaman((prev) => prev - 1);
      } else {
        setPemicuMuatUlang((prev) => prev + 1);
      }
    } catch (galat) {
      setPesanGalat(ekstrakPesanGalat(galat, "Gagal menghapus data mahasiswa"));
    } finally {
      setSedangMenghapusId(null);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Daftar Mahasiswa</h1>
          <small>
            Backend aktif: <strong>{konfigurasiBackend.nama.toUpperCase()}</strong>
          </small>
        </div>

        <Link to="/mahasiswa/tambah">
          <button type="button">+ Tambah Mahasiswa</button>
        </Link>
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          type="search"
          placeholder="Cari nama atau NIM"
          value={cari}
          onChange={(peristiwa) => {
            setHalaman(1);
            setCari(peristiwa.target.value);
          }}
        />
      </div>

      {sedangMemuat && <p>Memuat data...</p>}

      {pesanSukses && <p style={{ color: "green" }}>{pesanSukses}</p>}

      {pesanGalat && <p style={{ color: "crimson" }}>{pesanGalat}</p>}

      {sedangMemuat === false && daftar.length === 0 && <p>Data tidak ditemukan</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 16 }}>
        <thead>
          <tr>
            <th>NIM</th>
            <th>Nama</th>
            <th>Angkatan</th>
            <th>IPK</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((mahasiswa) => (
            <tr key={mahasiswa.id}>
              <td>{mahasiswa.nim}</td>
              <td>{mahasiswa.nama}</td>
              <td>{mahasiswa.angkatan}</td>
              <td>{mahasiswa.ipk}</td>
              <td>
                <button type="button" onClick={() => tanganiHapus(mahasiswa)} disabled={sedangMenghapusId === mahasiswa.id} style={{ color: "crimson" }}>
                  {sedangMenghapusId === mahasiswa.id ? "Menghapus..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && (
        <div style={{ marginTop: 16 }}>
          <button onClick={() => setHalaman(halaman - 1)} disabled={halaman <= 1}>
            Sebelumnya
          </button>

          <span style={{ margin: "0 12px" }}>
            Halaman {meta.halamanSaatIni} dari {meta.totalHalaman}
          </span>

          <button onClick={() => setHalaman(halaman + 1)} disabled={meta.halamanSaatIni >= meta.totalHalaman}>
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
