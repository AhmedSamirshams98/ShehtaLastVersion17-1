import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile images
      "localhost",                  // Local development
      "shehtatrading.com" 
               // Your production domain
    ],
    unoptimized: true, // 
  },
};

export default nextConfig;