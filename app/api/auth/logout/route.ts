// /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // مسح الكوكيز أو التوكن الخاص بالجلسة
  const response = NextResponse.json({ message: "Logged out successfully" });
  
  // حذف الكوكيز
  response.cookies.set({
    name: "token", // اسم الكوكيز حسب مشروعك
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
