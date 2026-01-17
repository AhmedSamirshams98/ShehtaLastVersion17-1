// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    const data = await request.json();
    const role = data.role;

    if (!role) {
      return NextResponse.json({ error: "الدور مطلوب" }, { status: 400 });
    }

    const updatedUser = await prisma.appUsers.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json({ error: "فشل في تعديل الدور" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    const existingUser = await prisma.appUsers.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    await prisma.appUsers.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "تم حذف المستخدم بنجاح" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ error: "فشل في حذف المستخدم" }, { status: 500 });
  }
}
