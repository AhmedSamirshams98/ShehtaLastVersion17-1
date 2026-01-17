import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all users
export async function GET() {
  try {
    const users = await prisma.appUsers.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل في جلب المستخدمين" }, { status: 500 });
  }
}

// PUT update user role
export async function PUT(req: NextRequest) {
  try {
    const { id, role } = await req.json();
    if (!id || !role) {
      return NextResponse.json({ error: "المعرف والدور مطلوبان" }, { status: 400 });
    }

    const updatedUser = await prisma.appUsers.update({
      where: { id: id },
      data: { role },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل في تعديل الدور" }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    await prisma.appUsers.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل في حذف المستخدم" }, { status: 500 });
  }
}
