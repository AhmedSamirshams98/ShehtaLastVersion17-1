import Image from "next/image";
import React, { useState, useEffect } from "react";
import shehtalogo from "../../../public/images/shehtalogo.png";
import { RiCloseLine, RiMenu2Fill } from "react-icons/ri";
import { mainNavLinks, dashboardNavLinks } from "@/data/constants";
import Link from "next/link";

interface MobileNavProps {
  isDashboard?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isDashboard = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // اختيار الروابط بناءً على الصفحة
  const links = isDashboard ? dashboardNavLinks : mainNavLinks;
  const title = isDashboard ? "شحتة للتجارة" : "شحتة للتجارة";

  useEffect(() => {
    if (isMenuOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-row items-center justify-between  w-full py-2">
      <div className="flex flex-row justify-between w-full backdrop-blur-3xl z-[50]  bg-gradient-to-r from-[#3B260680] to-[#3B260680]/50 text rounded-[42px]">
        <Link
          className="flex flex-row gap-1 items-center z-[60]"
          href={isDashboard ? "/dashboard" : "/"}
        >
          <Image
            width={31}
            height={40}
            className="object-cover"
            src={shehtalogo}
            alt="shehtatraidingcars شحتة للتجارة"
          />
          <h1 className="font-bold">{title}</h1>
        </Link>

        <button
          onClick={toggleMenu}
          className="text-2xl p-2 z-[60]"
          aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenu2Fill />}
        </button>
      </div>

      {/* القائمة الجانبية */}
      {isVisible && (
        <div
          className={`fixed top-0 right-0 w-full h-full  backdrop-blur-3xl bg-black/30 z-40 transition-opacity ease-in-out duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="px-[8%] py-[20%]" dir="rtl">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className={`block py-3 text-white text-[4vw] rounded px-2 transition-all duration-300 hover:text-[#fdba00] ${
                  isAnimating
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
