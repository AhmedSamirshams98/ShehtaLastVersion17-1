import type { Metadata } from "next";
import "../app/components/styles/globals.css";

import "../app/components/styles/fonts.css";
import Nav from "./components/nav/Nav";
import Footer from "./components/Footer/Footer";

export const metadata: Metadata = {
  title: "Shehta Project",
  description: "Shehta Trading FullStack Project",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-graphic">
        <Nav />
        <main className="relative top-0 w-screen ">
          {" "}
          {/* إضافة padding-top */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
