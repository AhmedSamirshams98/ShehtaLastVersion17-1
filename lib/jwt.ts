// lib/jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export interface JwtPayloadCustom {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signToken(
  payload: Omit<JwtPayloadCustom, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayloadCustom | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") return null;

    const d = decoded as JwtPayload;

    // تحقق إن الحقول اللي محتاجها موجودة
    if (
      typeof d.sub !== "number" ||
      typeof d.email !== "string" ||
      typeof d.role !== "string"
    ) {
      return null;
    }

    // هنا نرجع object مضبوط على النوع بتاعنا
    return {
      sub: d.sub,
      email: d.email,
      role: d.role,
      iat: d.iat,
      exp: d.exp,
    } as JwtPayloadCustom;
  } catch {
    return null;
  }
}
