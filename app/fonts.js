// src/app/fonts.js
import localFont from "next/font/local";

export const graphikArabic = localFont({
  src: [
    { path: "./../public/fonts/GraphikArabic-Black.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/GraphikArabic-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/GraphikArabic-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});
