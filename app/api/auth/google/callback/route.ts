import { NextRequest, NextResponse } from "next/server";
import { signToken } from "../../../../../lib/jwt";
import prisma from "@/lib/prisma";

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/?error=no_code_provided", request.url),
    );
  }

  try {
    // 1) استبدال الكود بتوكن من Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokenData.access_token) {
      console.error("Failed to get access token", tokenData);
      return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }

    // 2) جلب بيانات المستخدم من Google
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    if (!userRes.ok) {
      return NextResponse.redirect(
        new URL("/?error=profile_failed", request.url),
      );
    }

    const profile = await userRes.json();

    const googleId = profile.id;
    const email = profile.email;
    const name = profile.name;
    const picture = profile.picture;

    // 3) إدخال أو تحديث المستخدم في DB باستخدام Prisma
    const user = await prisma.appUsers.upsert({
      where: { email },
      update: {
        google_id: googleId,
        name,
        picture,
        updated_at: new Date(),
      },
      create: {
        google_id: googleId,
        email,
        name,
        picture,
        role: "user",
      },
    });

    // 4) توليد JWT
    const jwtToken = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 5) ضبط الكوكي وإعادة التوجيه
    const isProd = process.env.NODE_ENV === "production";
    const redirectUrl =
      // user.role === "admin" ? "https://shehtatrading.com/dashboard/cars" : "https://shehtatrading.com/cars";
      user.role === "admin" ? "/dashboard/cars" : "/";

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // أسبوع
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.redirect(new URL("/?error=server_error", request.url));
  }
}
