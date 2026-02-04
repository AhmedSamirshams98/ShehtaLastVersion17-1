

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cursorId = url.searchParams.get("cursor"); // id آخر سيارة جلبناها
    const limit = 10; // عدد السيارات لكل طلب

    const cars = await prisma.cars.findMany({
      where: { status: "available" },
      include: { car_images: true },
      orderBy: { created_at: "desc" }, // الأحدث أولاً
      take: limit,
      ...(cursorId ? { cursor: { id: Number(cursorId) }, skip: 1 } : {}),
    });

    const nextCursor = cars.length > 0 ? cars[cars.length - 1].id : null;

    return NextResponse.json({ cars, nextCursor });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
