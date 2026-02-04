
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

type CarStatusType = "available" | "unavailable";

// =================== GET مع Pagination ===================
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cursorId = url.searchParams.get("cursor"); // id آخر سيارة تم جلبها
    const limit = 10; // عدد السيارات لكل طلب

    const cars = await prisma.cars.findMany({
      include: { car_images: true },
      orderBy: { created_at: "asc" }, // الأقدم أولًا
      take: limit,
      ...(cursorId ? { cursor: { id: Number(cursorId) }, skip: 1 } : {}),
    });

    const formattedCars = cars.map((car) => ({
      ...car,
      images: car.car_images.map((img) => img.image_url),
      created_at: car.created_at.toISOString(),
      updated_at: car.updated_at.toISOString(),
    }));

    const nextCursor = cars.length > 0 ? cars[cars.length - 1].id : null;

    return NextResponse.json({ cars: formattedCars, nextCursor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "فشل في جلب السيارات" },
      { status: 500 },
    );
  }
}

// =================== POST لإضافة سيارة جديدة ===================
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const year = parseInt(formData.get("year") as string);
    const condition = formData.get("condition") as string;
    const description = formData.get("description") as string;
    const kilometers = parseInt(formData.get("kilometers") as string) || 0;
    const price = parseInt(formData.get("price") as string) || 0;
    const statusStr = formData.get("status")?.toString();

    const carStatus: CarStatusType =
      statusStr === "unavailable" ? "unavailable" : "available";

    if (!brand || !model) {
      return NextResponse.json(
        { error: "العلامة التجارية والموديل مطلوبان" },
        { status: 400 },
      );
    }

    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.chmodSync(uploadDir, 0o755);
    }

    const car = await prisma.cars.create({
      data: {
        brand,
        model,
        year,
        condition,
        description,
        kilometers,
        price,
        status: carStatus,
      },
    });

    const files = formData.getAll("images") as File[];
    const savedImages: string[] = [];

    if (!files || files.length === 0) {
      await prisma.cars.delete({ where: { id: car.id } });
      return NextResponse.json(
        { error: "يجب إضافة صورة واحدة على الأقل" },
        { status: 400 },
      );
    }

    for (const file of files) {
      try {
        if (!file.type.startsWith("image/")) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${timestamp}-${safeName}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, buffer);
        fs.chmodSync(filePath, 0o644);

        const imageUrl = `/api/images/${fileName}`;
        savedImages.push(imageUrl);

        await prisma.car_images.create({
          data: { image_url: imageUrl, car_id: car.id },
        });

      } catch (fileError) {
        console.error(`خطأ أثناء حفظ الملف ${file.name}:`, fileError);
      }
    }

    if (savedImages.length === 0) {
      await prisma.cars.delete({ where: { id: car.id } });
      return NextResponse.json(
        { error: "فشل في حفظ الصور. يرجى المحاولة مرة أخرى" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ...car, images: savedImages }, { status: 201 });
  } catch (error) {
    console.error("Car creation error:", error);
    return NextResponse.json(
      { error: "فشل في إضافة السيارة" },
      { status: 500 },
    );
  }
}
