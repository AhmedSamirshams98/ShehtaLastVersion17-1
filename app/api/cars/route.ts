// // app/api/cars/route.ts
// import { NextResponse } from "next/server";

// import prisma from "@/lib/prisma";
// import fs from "fs";
// import path from "path";

// type CarStatusType = "available" | "unavailable";

// export async function GET() {
//   try {
//     const cars = await prisma.cars.findMany({
//       include: { car_images: true },
//         orderBy: { created_at: "asc" }, // الأقدم أولًا

//     });

//     const formattedCars = cars.map((car) => ({
//       ...car,
//       images: car.car_images.map((img) => img.image_url),
//       created_at: car.created_at.toISOString(),
//       updated_at: car.updated_at.toISOString(),
//     }));

//     return NextResponse.json(formattedCars);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to fetch cars" },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const brand = formData.get("brand") as string;
//     const model = formData.get("model") as string;
//     const year = parseInt(formData.get("year") as string);
//     const condition = formData.get("condition") as string;
//     const description = formData.get("description") as string;
//     const kilometers = parseInt(formData.get("kilometers") as string) || 0;
//     const price = parseInt(formData.get("price") as string) || 0;
//     const statusStr = formData.get("status")?.toString();

//     const carStatus: CarStatusType =
//       statusStr === "unavailable" ? "unavailable" : "available";

//     // Validate required fields
//     if (!brand || !model) {
//       return NextResponse.json(
//         { error: "العلامة التجارية والموديل مطلوبان" },
//         { status: 400 },
//       );
//     }

//     // CHANGED: Store uploads OUTSIDE public folder (in root/uploads)
//     const uploadDir = path.join(process.cwd(), "uploads");

//     // Create upload directory with proper permissions
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//       fs.chmodSync(uploadDir, 0o755);
//     }

//     // Create car record first
//     const car = await prisma.cars.create({
//       data: {
//         brand,
//         model,
//         year,
//         condition,
//         description,
//         kilometers,
//         price,
//         status: carStatus,
//       },
//     });

//     const files = formData.getAll("images") as File[];
//     const savedImages: string[] = [];

//     // Validate files
//     if (!files || files.length === 0) {
//       await prisma.cars.delete({ where: { id: car.id } });
//       return NextResponse.json(
//         { error: "يجب إضافة صورة واحدة على الأقل" },
//         { status: 400 },
//       );
//     }

//     for (const file of files) {
//       try {
//         // Validate file type
//         if (!file.type.startsWith("image/")) {
//           console.warn(`Skipping non-image file: ${file.name}`);
//           continue;
//         }

//         const bytes = await file.arrayBuffer();
//         const buffer = Buffer.from(bytes);

//         // Create safe filename
//         const timestamp = Date.now();
//         const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
//         const fileName = `${timestamp}-${safeName}`;
//         const filePath = path.join(uploadDir, fileName);

//         // Write file with proper permissions
//         fs.writeFileSync(filePath, buffer);
//         fs.chmodSync(filePath, 0o644);

//         // CHANGED: Use API route URL instead of /uploads/
//         const imageUrl = `/api/images/${fileName}`;
//         savedImages.push(imageUrl);

//         await prisma.car_images.create({
//           data: { image_url: imageUrl, car_id: car.id },
//         });

//         console.log(`Successfully saved image: ${fileName}`);
//       } catch (fileError) {
//         console.error(`Error processing file ${file.name}:`, fileError);
//       }
//     }

//     // Check if any images were successfully saved
//     if (savedImages.length === 0) {
//       await prisma.cars.delete({ where: { id: car.id } });

//       return NextResponse.json(
//         { error: "فشل في حفظ الصور. يرجى المحاولة مرة أخرى" },
//         { status: 400 },
//       );
//     }

//     return NextResponse.json({ ...car, images: savedImages }, { status: 201 });
//   } catch (error) {
//     console.error("Car creation error:", error);
//     return NextResponse.json(
//       { error: "فشل في إضافة السيارة" },
//       { status: 500 },
//     );
//   }
// }

// app/api/cars/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

type CarStatusType = "available" | "unavailable";

// دالة لمساعدة في تنسيق بيانات السيارة
const formatCar = (car: any) => ({
  ...car,
  images: car.car_images.map((img: any) => img.image_url),
  created_at: car.created_at.toISOString(),
  updated_at: car.updated_at.toISOString(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // الصفحة وعدد العناصر لكل صفحة
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10"))); // الحد الأقصى 50
    const skip = (page - 1) * limit;

    // جلب السيارات مع Pagination
    const cars = await prisma.cars.findMany({
      include: { car_images: true },
      orderBy: { created_at: "asc" },
      skip,
      take: limit,
    });

    const totalCars = await prisma.cars.count();

    const formattedCars = cars.map(formatCar);

    return NextResponse.json({
      data: formattedCars,
      pagination: {
        total: totalCars,
        page,
        limit,
        totalPages: Math.ceil(totalCars / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/cars error:", error);
    return NextResponse.json({ error: "فشل في جلب السيارات" }, { status: 500 });
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
    const carStatus: CarStatusType = statusStr === "unavailable" ? "unavailable" : "available";

    if (!brand || !model) {
      return NextResponse.json({ error: "العلامة التجارية والموديل مطلوبان" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.chmodSync(uploadDir, 0o755);
    }

    const car = await prisma.cars.create({
      data: { brand, model, year, condition, description, kilometers, price, status: carStatus },
    });

    const files = formData.getAll("images") as File[];
    const savedImages: string[] = [];

    if (!files || files.length === 0) {
      await prisma.cars.delete({ where: { id: car.id } });
      return NextResponse.json({ error: "يجب إضافة صورة واحدة على الأقل" }, { status: 400 });
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

        console.log(`Saved image: ${fileName}`);
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
      }
    }

    if (savedImages.length === 0) {
      await prisma.cars.delete({ where: { id: car.id } });
      return NextResponse.json({ error: "فشل في حفظ الصور" }, { status: 400 });
    }

    return NextResponse.json({ ...car, images: savedImages }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cars error:", error);
    return NextResponse.json({ error: "فشل في إضافة السيارة" }, { status: 500 });
  }
}
