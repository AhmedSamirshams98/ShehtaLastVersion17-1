import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // assume prisma client موجود هنا

export async function GET() {
  try {
    const availableCars = await prisma.cars.findMany({
      where: { status: "available" }, // فقط المتاحة
      include: { car_images: true }, // جلب الصور
      orderBy: { created_at: "desc" }, // آخر السيارات أولاً
    });

    return NextResponse.json({ cars: availableCars });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
