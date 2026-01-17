// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // جلب الكوكيز من next/headers
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // console.log("Token from cookies:", token ? "Exists" : "Missing");

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // التحقق من التوكن
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // جلب بيانات المستخدم من قاعدة البيانات
    const user = await prisma.appUsers.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        picture: true,
      },
    });

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    console.log("User found in DB:", user.email, "Role:", user.role);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.picture, // ⚠️ هنا نستخدم picture ونرسلها كـ image
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

// دعم طريقة OPTIONS للـ CORS (اختياري)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
