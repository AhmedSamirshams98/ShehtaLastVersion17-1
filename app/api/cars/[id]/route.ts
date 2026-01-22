// app/api/cars/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const carId = parseInt(id);

    if (isNaN(carId)) {
      return NextResponse.json(
        { error: "معرف السيارة غير صحيح" },
        { status: 400 },
      );
    }

    const car = await prisma.cars.findUnique({
      where: { id: carId },
      include: { car_images: true },
    });

    if (!car) {
      return NextResponse.json(
        { error: "السيارة غير موجودة" },
        { status: 404 },
      );
    }

    const formattedCar = {
      id: car.id,
      brand: car.brand,
      model: car.model,
      description: car.description,
      condition: car.condition,
      year: car.year,
      kilometers: car.kilometers,
      price: car.price,
      status: car.status,
      images: car.car_images.map((img) => img.image_url),
      created_at: car.created_at.toISOString(),
      updated_at: car.updated_at.toISOString(),
    };

    return NextResponse.json(formattedCar);
  } catch (error) {
    console.error("❌ Error fetching car:", error);
    return NextResponse.json(
      { error: "فشل في جلب بيانات السيارة" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const carId = parseInt(id);
    const data = await request.json();

    if (isNaN(carId)) {
      return NextResponse.json(
        { error: "معرف السيارة غير صحيح" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.cars.update({
        where: { id: carId },
        data: {
          brand: data.brand,
          model: data.model,
          year: data.year,
          condition: data.condition,
          description: data.description,
          price:data.price,
          kilometers: data.kilometers,
          status: data.status,
          updated_at: new Date(),
        },
      });

      await tx.car_images.deleteMany({ where: { car_id: carId } });

      if (data.images && data.images.length > 0) {
        await tx.car_images.createMany({
          data: data.images.map((imageUrl: string) => ({
            car_id: carId,
            image_url: imageUrl,
          })),
        });
      }

      return tx.cars.findUnique({
        where: { id: carId },
        include: { car_images: { select: { image_url: true } } },
      });
    });

    if (!result) {
      throw new Error("Failed to update car");
    }

    const formattedCar = {
      id: result.id,
      brand: result.brand,
      model: result.model,
      description: result.description,
      kilometers: result.kilometers,
      price:result.price,
      status: result.status,
      images: result.car_images.map((img) => img.image_url),
      created_at: result.created_at.toISOString(),
      updated_at: result.updated_at.toISOString(),
    };

    return NextResponse.json(formattedCar);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "فشل في تحديث السيارة" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const carId = parseInt(id);

    if (isNaN(carId)) {
      return NextResponse.json(
        { error: "معرف السيارة غير صحيح" },
        { status: 400 },
      );
    }

    const existingCar = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      return NextResponse.json(
        { error: "السيارة غير موجودة" },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.car_images.deleteMany({
        where: { car_id: carId },
      });

      await tx.cars.delete({
        where: { id: carId },
      });
    });

    return NextResponse.json(
      { message: "تم حذف السيارة بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ error: "فشل في حذف السيارة" }, { status: 500 });
  }
}
