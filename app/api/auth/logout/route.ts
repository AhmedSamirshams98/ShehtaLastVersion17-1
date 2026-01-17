// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "تم تسجيل الخروج" });

  // حذف الكوكيز
  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set({
    name: "user_role",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
