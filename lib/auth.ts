// lib/auth.ts
import { IncomingMessage } from "http";
import { parse as parseCookie } from "cookie";
import { verifyToken } from "./jwt";
import pool from "../lib/db";
export async function getUserFromReq(req: IncomingMessage) {
  const header = req.headers.cookie || "";
  const cookies = parseCookie(header);
  const token = cookies.token;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // تأكد من وجود المستخدم في DB وجلب الدور
  const res = await pool.query(
    "SELECT id, email, name, role FROM users WHERE id = $1",
    [payload.sub]
  );
  if (res.rowCount === 0) return null;
  return res.rows[0]; // { id, email, name, role }
}
