import klien from "./klien";
import { buatPayloadLogin } from "./adaptorBackend";

export async function login(email, kataSandi) {
  const respons = await klien.post("/auth/login", buatPayloadLogin(email, kataSandi));

  return respons.data;
}

export async function ambilProfil() {
  const respons = await klien.get("/auth/profil");

  return respons.data;
}

export async function logout() {
  const respons = await klien.post("/auth/logout");

  return respons.data;
}
