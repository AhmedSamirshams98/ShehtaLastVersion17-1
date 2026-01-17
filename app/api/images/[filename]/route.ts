// app/api/images/[filename]/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> } // params is now a Promise
) {
  try {
    // Await the params to get the actual values
    const { filename } = await params;
    
    // Read from uploads folder in project root
    const filePath = path.join(process.cwd(), "uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Image not found: ${filePath}`);
      return new NextResponse("Image not found", { status: 404 });
    }

    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.ico': 'image/x-icon',
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Return image with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}