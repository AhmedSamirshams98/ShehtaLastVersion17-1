// app/api/cars/route.ts
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

type CarStatusType = "available" | "unavailable";

export async function GET() {
  try {
    const cars = await prisma.cars.findMany({
      include: { car_images: true },
    });

    const formattedCars = cars.map((car) => ({
      ...car,
      images: car.car_images.map((img) => img.image_url),
      created_at: car.created_at.toISOString(),
      updated_at: car.updated_at.toISOString(),
    }));

    return NextResponse.json(formattedCars);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 },
    );
  }
}

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

    // Validate required fields
    if (!brand || !model) {
      return NextResponse.json(
        { error: "العلامة التجارية والموديل مطلوبان" },
        { status: 400 },
      );
    }

    // CHANGED: Store uploads OUTSIDE public folder (in root/uploads)
    const uploadDir = path.join(process.cwd(), "uploads");

    // Create upload directory with proper permissions
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.chmodSync(uploadDir, 0o755);
    }

    // Create car record first
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

    // Validate files
    if (!files || files.length === 0) {
      await prisma.cars.delete({ where: { id: car.id } });
      return NextResponse.json(
        { error: "يجب إضافة صورة واحدة على الأقل" },
        { status: 400 },
      );
    }

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.warn(`Skipping non-image file: ${file.name}`);
          continue;
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create safe filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${timestamp}-${safeName}`;
        const filePath = path.join(uploadDir, fileName);

        // Write file with proper permissions
        fs.writeFileSync(filePath, buffer);
        fs.chmodSync(filePath, 0o644);

        // CHANGED: Use API route URL instead of /uploads/
        const imageUrl = `/api/images/${fileName}`;
        savedImages.push(imageUrl);

        await prisma.car_images.create({
          data: { image_url: imageUrl, car_id: car.id },
        });

        console.log(`Successfully saved image: ${fileName}`);
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
      }
    }

    // Check if any images were successfully saved
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
