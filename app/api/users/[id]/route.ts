import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { role } = await req.json();
    const id = parseInt(params.id);

    if (!role) {
      return NextResponse.json({ error: "الدور مطلوب" }, { status: 400 });
    }

    const updatedUser = await prisma.appUsers.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل في تعديل الدور" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.appUsers.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل في حذف المستخدم" }, { status: 500 });
  }
}
