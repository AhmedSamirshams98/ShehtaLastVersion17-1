import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET كل المستخدمين
export async function GET() {
  const users = await prisma.appUsers.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  return NextResponse.json({ users });
}

// POST إضافة مستخدم جديد (superadmin فقط)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
  }

  // تشفير الباسورد
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.appUsers.create({
      data: { name, email, password: hashedPassword, role },
    });
    return NextResponse.json({ user });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "الإيميل مستخدم مسبقًا" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
