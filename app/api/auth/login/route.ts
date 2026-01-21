import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "البريد وكلمة المرور مطلوبة" }, { status: 400 });
  }

  const user = await prisma.appUsers.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "الإيميل غير موجود" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  // توليد JWT
  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  const response = NextResponse.json({ message: "تم تسجيل الدخول", user });
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
