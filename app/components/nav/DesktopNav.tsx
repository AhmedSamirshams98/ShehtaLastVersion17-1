// components/DesktopNav.tsx
"use client";
import React from "react";
import shehtalogo from "../../../public/images/shehtalogo.png";
import Image from "next/image";
import { mainNavLinks } from "@/data/constants";
import Link from "next/link";


const DesktopNav = () => {
  return (
    <div
      className="flex flex-row  w-[87%] md:w-[70%] lg:w-[70%]"
      style={{ direction: "rtl" }}
    >
      <div className="w-full flex flex-row backdrop-blur-3xl items-center p-[1%] justify-between rounded-[42px] bg-gradient-to-r from-[#3B260680] to-[#3B260680]/50 text-[1.2vw] lg:text-[1vw]">
        <Link href="/">
          <div className="flex flex-row items-center gap-4">
            <Image
              width={35}
              height={35}
              src={shehtalogo}
              alt="shehtatraidingcars شحتة للتجارة"
            />
            <h3 className="font-bold text-[1vw]">شحتة للتجارة</h3>
          </div>
        </Link>
        {mainNavLinks.map((link) => (
          <Link key={link.id} href={link.path}>
            <h1 className="text-[0.8vw] hover:text-[#fdba00] transition-colors">
              {link.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DesktopNav;
