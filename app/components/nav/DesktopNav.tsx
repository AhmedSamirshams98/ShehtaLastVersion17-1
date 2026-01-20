// components/DesktopNav.tsx
"use client";
import React, { useEffect, useState } from "react";
import shehtalogo from "../../../public/images/shehtalogo.png";
import Image from "next/image";
import { mainNavLinks, dashboardNavLinks } from "@/data/constants";
import Link from "next/link";
import { User } from "@/types/car";
import { useRouter } from "next/navigation";

interface DesktopNavProps {
  isDashboard?: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isDashboard = false }) => {
  const links = isDashboard ? dashboardNavLinks : mainNavLinks;
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (!data.user) {
            router.replace("/"); // إعادة التوجيه إذا لم يوجد مستخدم
          } else {
            setUser(data.user);
          }
        } else {
          router.replace("/"); // إعادة التوجيه إذا استجابة السيرفر غير OK
        }
      } catch (err) {
        console.error("Session error", err);
        router.replace("/"); // إعادة التوجيه في حالة الخطأ
      } finally {
      }
    };

    fetchSession();
  }, [router]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      router.push("/");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="flex flex-row  w-[87%] md:w-[70%] lg:w-[70%]" style={{ direction: "rtl" }}>
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
        {links.map((link) => (
          <Link key={link.id} href={link.path}>
            <h1 className="text-[0.8vw] hover:text-[#fdba00] transition-colors">
              {link.name}
            </h1>
          </Link>
        ))}
        {isDashboard && (
          <button
            aria-label="logout button"
            className=" p-1  flex items-center rounded-[26px] gap-1   transition-colors"
            onClick={logout}
          >
            <h1> تسجيل الخروج</h1>
          </button>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
