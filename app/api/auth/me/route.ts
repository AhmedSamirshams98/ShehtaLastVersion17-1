import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded: any = jwt.verify(token, secret);

    const user = await prisma.appUsers.findUnique({
      where: { id: decoded.sub },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return NextResponse.json({ user: null }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth/me error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
