import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalCars = await prisma.cars.count();
    const availableCars = await prisma.cars.count({
      where: { status: "available" },
    });
    const totalOrders = await prisma.forms.count();
    const totalUsers = await prisma.appUsers.count();

    return NextResponse.json({ totalCars, availableCars, totalOrders,totalUsers });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
