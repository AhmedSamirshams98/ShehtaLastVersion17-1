// lib/cookies.ts
import { serialize } from "cookie";

export function setTokenCookie(token: string, isProd: boolean) {
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return cookie;
}