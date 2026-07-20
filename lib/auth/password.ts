import "server-only";
import bcrypt from "bcryptjs";

// Hash dummy usado cuando el usuario no coincide, para que bcrypt.compare
// siempre corra y el tiempo de respuesta no delate si el usuario existe.
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeOgymYFR6c2Za3v3nZI8cs/z8L1n3l3S6";

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // .trim() defiende contra espacios/CRLF finales que algunos flujos de
  // configuracion de variables de entorno (dashboards, CLIs en Windows)
  // pueden dejar accidentalmente al pegar/canalizar el valor.
  const expectedUser = process.env.NPS_ADMIN_USER?.trim();
  const expectedHash = process.env.NPS_ADMIN_PASSWORD_HASH?.trim() || DUMMY_HASH;

  const userMatches = Boolean(expectedUser) && username.trim() === expectedUser;
  const passwordMatches = await bcrypt.compare(
    password,
    userMatches ? expectedHash : DUMMY_HASH
  );

  return userMatches && passwordMatches;
}
