// components/Nav.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import backgroundimage from "../../../public/images/backgroundimage.png";
import { usePathname } from "next/navigation";

const Nav = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
        const main = document.querySelector("main");
        if (main) {
          main.style.paddingTop = pathname === "/" ? "0px" : `${navHeight}px`;
        }
      }
    };

    checkIsMobile();
    updateNavHeight();

    window.addEventListener("resize", checkIsMobile);
    window.addEventListener("resize", updateNavHeight);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("resize", updateNavHeight);
    };
  }, [navHeight, pathname]);

  const isHome = pathname === "/";
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header
      ref={navRef}
      className="fixed top-0  text-white z-[90] px-[8%]  lg:px-0   py-[1%] w-full flex items-center justify-center transition-all duration-300"
      style={{
        direction: "rtl",
        backgroundImage: !isHome ? `url(${backgroundimage.src})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isMobile ? (
        <MobileNav isDashboard={isDashboard} />
      ) : (
        <DesktopNav isDashboard={isDashboard} />
      )}
    </header>
  );
};

export default Nav;
