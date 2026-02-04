// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   const reels = await prisma.reel.findMany({
//     orderBy: { createdAt: "desc" },
//   });
//   return NextResponse.json(reels);
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { src } = body;
//     if (!src)
//       return NextResponse.json({ error: "src is required" }, { status: 400 });

//     const reel = await prisma.reel.create({ data: { src } });
//     return NextResponse.json(reel);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }


// export async function PATCH(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { id, src } = body;

//     if (!id || !src) {
//       return NextResponse.json(
//         { error: "id and src are required" },
//         { status: 400 }
//       );
//     }

//     const reel = await prisma.reel.update({
//       where: { id },
//       data: { src },
//     });

//     return NextResponse.json(reel);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }


// export async function DELETE(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = Number(searchParams.get("id"));
//     if (!id)
//       return NextResponse.json({ error: "id is required" }, { status: 400 });

//     await prisma.reel.delete({ where: { id } });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: جلب جميع الفيديوهات مع ترتيب الفيديو الأحدث أولًا
export async function GET() {
  try {
    const reels = await prisma.reel.findMany({
      orderBy: [
        { isLatest: "desc" },
        { createdAt: "desc" }
      ],
    });
    return NextResponse.json(reels);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST: إضافة فيديو جديد وجعله الأحدث دائمًا
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { src } = body;
    if (!src)
      return NextResponse.json({ error: "src is required" }, { status: 400 });

    // إعادة تعيين جميع الفيديوهات القديمة إلى false
    await prisma.reel.updateMany({
      data: { isLatest: false },
    });

    // إنشاء الفيديو الجديد كأحدث فيديو
    const reel = await prisma.reel.create({
      data: { src, isLatest: true },
    });

    return NextResponse.json(reel);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, src, makeLatest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (src) updateData.src = src;
    if (makeLatest) {
      updateData.isLatest = true;
      // إعادة تعيين الفيديوهات القديمة
      await prisma.reel.updateMany({ data: { isLatest: false } });
    }

    const reel = await prisma.reel.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(reel);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


// DELETE: حذف فيديو، وإذا كان هو الأحدث، يتم تحديث الفيديو التالي ليصبح الأحدث
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id)
      return NextResponse.json({ error: "id is required" }, { status: 400 });

    // تحقق إذا كان هذا الفيديو هو الأحدث قبل الحذف
    const reelToDelete = await prisma.reel.findUnique({ where: { id } });
    const wasLatest = reelToDelete?.isLatest;

    // حذف الفيديو
    await prisma.reel.delete({ where: { id } });

    // إذا كان الأحدث، اجعل الفيديو التالي الأحدث
    if (wasLatest) {
      const nextLatest = await prisma.reel.findFirst({
        orderBy: { createdAt: "desc" },
      });
      if (nextLatest) {
        await prisma.reel.update({
          where: { id: nextLatest.id },
          data: { isLatest: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
