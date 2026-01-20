// app/layout.tsx
import "../app/components/styles/globals.css";
import { graphikArabic } from "./fonts";

import Nav from "./components/nav/Nav";
import Footer from "./components/Footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shehta Project",
  description: "Shehta Trading FullStack Project",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" className={graphikArabic.className}>
      <body >
        <Nav />
        <main className="relative top-0 ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
