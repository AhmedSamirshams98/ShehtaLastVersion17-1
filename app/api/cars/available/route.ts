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

// app/api/cars/available/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // دالة لمساعدة في تنسيق بيانات السيارة
// const formatCar = (car: any) => ({
//   ...car,
//   images: car.car_images.map((img: any) => img.image_url),
//   created_at: car.created_at.toISOString(),
//   updated_at: car.updated_at.toISOString(),
// });

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);

//     // الصفحة وعدد العناصر لكل صفحة
//     const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
//     const limit = Math.min(
//       50,
//       Math.max(1, parseInt(searchParams.get("limit") || "10")),
//     );
//     const skip = (page - 1) * limit;

//     // جلب السيارات المتاحة فقط مع Pagination
//     const cars = await prisma.cars.findMany({
//       where: { status: "available" }, // الفلتر هنا
//       include: { car_images: true },
//       orderBy: { created_at: "asc" },
//       skip,
//       take: limit,
//     });

//     const totalCars = await prisma.cars.count({
//       where: { status: "available" }, // الفلتر هنا أيضاً
//     });

//     const formattedCars = cars.map(formatCar);

//     return NextResponse.json({
//       data: formattedCars,
//       pagination: {
//         total: totalCars,
//         page,
//         limit,
//         totalPages: Math.ceil(totalCars / limit),
//         hasMore: page < Math.ceil(totalCars / limit),
//       },
//     });
//   } catch (error) {
//     console.error("GET /api/cars/available error:", error);
//     return NextResponse.json(
//       { error: "فشل في جلب السيارات المتاحة" },
//       { status: 500 },
//     );
//   }
// }
