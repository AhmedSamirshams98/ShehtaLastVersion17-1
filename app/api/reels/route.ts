import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reels = await prisma.reel.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reels);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { src } = body;
    if (!src)
      return NextResponse.json({ error: "src is required" }, { status: 400 });

    const reel = await prisma.reel.create({ data: { src } });
    return NextResponse.json(reel);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id)
      return NextResponse.json({ error: "id is required" }, { status: 400 });

    await prisma.reel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
