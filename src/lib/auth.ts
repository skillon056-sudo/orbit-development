import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "orbit_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token?: string): Promise<{ username: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { username: String(payload.username) };
  } catch {
    return null;
  }
}

// Server-side session read (App Router). Returns null if not authed.
export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  return verifyToken(token);
}

export function sessionCookieName() {
  return COOKIE;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
