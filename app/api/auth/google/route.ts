// app/api/auth/google/route.ts (لبدء العملية)
import { NextResponse } from "next/server";

export async function GET() {
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  };

  Object.entries(params).forEach(([key, value]) => {
    googleAuthUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(googleAuthUrl.toString());
}
