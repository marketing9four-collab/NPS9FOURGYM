import "server-only";
import bcrypt from "bcryptjs";

// Hash dummy usado cuando el usuario no coincide, para que bcrypt.compare
// siempre corra y el tiempo de respuesta no delate si el usuario existe.
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeOgymYFR6c2Za3v3nZI8cs/z8L1n3l3S6";

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUser = process.env.NPS_ADMIN_USER;
  const expectedHash = process.env.NPS_ADMIN_PASSWORD_HASH || DUMMY_HASH;

  const userMatches = Boolean(expectedUser) && username === expectedUser;
  const passwordMatches = await bcrypt.compare(
    password,
    userMatches ? expectedHash : DUMMY_HASH
  );

  return userMatches && passwordMatches;
}
