import { SignJWT, jwtVerify } from "jose";
import { requiredEnv } from "@/lib/env";

export const SESSION_COOKIE = "nps_admin_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 horas

function getSecretKey() {
  return new TextEncoder().encode(requiredEnv("SESSION_SECRET"));
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}
