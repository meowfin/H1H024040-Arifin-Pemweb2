import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { simpanMahasiswa } from "../api/layananMahasiswa";
import { ekstrakGalatValidasi, ekstrakPesanGalat } from "../api/adaptorBackend";

export default function TambahMahasiswa() {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [ipk, setIpk] = useState("");
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);
  const [pesanGalat, setPesanGalat] = useState("");
  const [galatValidasi, setGalatValidasi] = useState({});

  const navigasi = useNavigate();

  async function tanganiKirim(peristiwa) {
    peristiwa.preventDefault();

    setPesanGalat("");
    setGalatValidasi({});
    setSedangMenyimpan(true);

    try {
      await simpanMahasiswa({
        nim: nim.trim(),
        nama: nama.trim(),
        angkatan: Number(angkatan),
        ipk: Number(ipk),
      });

      navigasi("/mahasiswa");
    } catch (galat) {
      setPesanGalat(ekstrakPesanGalat(galat, "Gagal menyimpan data mahasiswa"));
      setGalatValidasi(ekstrakGalatValidasi(galat));
    } finally {
      setSedangMenyimpan(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>Tambah Mahasiswa</h1>

      {pesanGalat && <p style={{ color: "crimson" }}>{pesanGalat}</p>}

      <form onSubmit={tanganiKirim}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="nim">NIM</label>
          <br />
          <input id="nim" type="text" value={nim} onChange={(e) => setNim(e.target.value)} placeholder="Contoh: H1H024001" style={{ width: "100%" }} />
          {galatValidasi.nim && <small style={{ color: "crimson" }}>{galatValidasi.nim}</small>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="nama">Nama Lengkap</label>
          <br />
          <input id="nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)} style={{ width: "100%" }} />
          {galatValidasi.nama && <small style={{ color: "crimson" }}>{galatValidasi.nama}</small>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="angkatan">Angkatan</label>
          <br />
          <input id="angkatan" type="number" value={angkatan} onChange={(e) => setAngkatan(e.target.value)} placeholder="Contoh: 2024" style={{ width: "100%" }} />
          {galatValidasi.angkatan && <small style={{ color: "crimson" }}>{galatValidasi.angkatan}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="ipk">IPK</label>
          <br />
          <input id="ipk" type="number" step="0.01" value={ipk} onChange={(e) => setIpk(e.target.value)} placeholder="Contoh: 3.75" style={{ width: "100%" }} />
          {galatValidasi.ipk && <small style={{ color: "crimson" }}>{galatValidasi.ipk}</small>}
        </div>

        <button type="submit" disabled={sedangMenyimpan}>
          {sedangMenyimpan ? "Menyimpan..." : "Simpan"}
        </button>

        <Link to="/mahasiswa" style={{ marginLeft: 12 }}>
          Batal
        </Link>
      </form>
    </div>
  );
}
