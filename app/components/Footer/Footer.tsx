"use client";
import React from "react";
import Image from "next/image";

import logo from "../../../public/images/shehtalogo.png";
import phone from "../../../public/images/phonenumber.svg";
import whatsapp from "../../../public/images/whatsapp.svg";
import instagram from "../../../public/images/instagram.svg";
import tiktok from "../../../public/images/tiktok.svg";
import facebook from "../../../public/images/facebook.svg";
import { Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathName = usePathname();
  const isDashboard = pathName?.startsWith("/dashboard");
  function openDialer() {
    const userAgent = navigator.userAgent;

    if (userAgent.match(/Android|iPhone|iPad|iPod|Huawei|HarmonyOS/i)) {
      window.location.href = "tel:+201000030607";
    } else {
      alert(
        " هذه الميزة متاحة فقط على الأجهزة المحمولة.رقم الاتصال :+201000030607",
      );
    }
  }
  function openWhatsApp() {
    const phoneNumber = "+201000030607";
    const message = "السلام عليكم عندي استفسار بخصوص سيارة";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank");
  }

  return (
    <div
      id="contact"
      className={` ${isDashboard ? "hidden" : "block"} bg-[#282828] text-black px-[8%]  py-[8%] md:py-[2%] w-full flex flex-col lg:flex-row items-center justify-between gap-6`}
      style={{ direction: "rtl" }}
    >
      {/**right part of footer */}
      <div className="flex flex-row gap-6">
        <div className="flex flex-col gap-2">
          <Image
            src={logo}
            alt="shehtatrading logo شحتة للتجاره"
            width={80} // Add appropriate width
            height={80} // Add appropriate height
            className="object-contain"
          />
          <h1 className="font-bold text-white text-md">شحتة للتجارة</h1>
        </div>
        <div className="flex flex-col justify-between">
          <h1 className="text-white font-bold text-md">تواصل معنا</h1>
          <div className="flex flex-col gap-4">
            <div onClick={openDialer} className="flex flex-row gap-4">
              <Image
                src={phone}
                alt="shehta trading number رقم شحتة للتجاره"
                width={24}
                height={24}
              />
              <h1 className="text-white font-bold underline text-md">
                201000030607+
              </h1>
            </div>
            <div onClick={openWhatsApp} className="flex flex-row gap-4">
              <Image
                src={whatsapp}
                alt="رقم واتساب شحتة للتجاره shehta trading whatsapp"
                width={24}
                height={24}
              />
              <h1 className="font-bold text-white text-md">
                واتـــــســــــاب
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/**second part of footer */}
      <div className="flex flex-col justify-between gap-4">
        <h1 className="text-white text-center md:text-justify">
          العنوان :<br />
          <span className="font-medium">
            كورنيش بلطيم الجديد - بلطيم - كفر الشيخ - مصر.
          </span>
        </h1>
        <div className="flex justify-center w-full">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://maps.app.goo.gl/viQqg5oHnF1b1Y736?g_st=com.google.maps.preview.copy"
          >
            <Button
              className="!bg-transparent !border-[1px] !border-white !rounded-[42px]"
              icon={
                <Image
                  src="/images/maps.svg"
                  width={12}
                  height={12}
                  alt="خرائط جوجل shehta trading location"
                />
              }
            >
              <span className="font-graphic text-white text-sm md:text-base">
                خرائط جوجل
              </span>
            </Button>
          </Link>
        </div>
        <div className="px-4 py-3 hidden lg:flex flex-col items-center gap-2">
          <p className="text-xs text-white/80 text-center">
            © {new Date().getFullYear()} شحتة للتجارة
          </p>
          <Link
            href="https://wa.me/201000094180"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/80 hover:text-primary transition-colors duration-200 underline"
          >
            Made With ❤️ By: Rafeeq.Academy Teams
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center md:items-start">
        <h1 className="font-bold text-white text-center md:text-justify">
          لمتابعة جديد المعروضات:
          <br />
          <span className="font-medium">
            تابعنا على مواقع التواصل الاجتماعى
          </span>
        </h1>
        <div className="flex flex-row gap-6">
          <Link
            href="https://www.instagram.com/shehta.trading?igsh=NGIyM2M1M3poYng2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={instagram}
              width={35}
              height={35}
              alt="صفحة انستجرام شحتة للتجارة"
            />
          </Link>
          <Link
            href="https://www.facebook.com/shehta.trading?mibextid=LQQJ4d"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={facebook}
              width={35}
              height={35}
              alt="صفحة فيسبوك شحتة للتجارة"
            />
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.tiktok.com/@shehta.trading?_t=8pf8K14ND1k&_r=1"
          >
            <Image
              src={tiktok}
              width={35}
              height={35}
              alt="صفحة تيك توك شحتة للتجارة"
            />
          </Link>
        </div>
        <div className="px-4 py-3 flex flex-col lg:hidden items-center gap-2">
          <p className="text-xs text-white/80 text-center">
            © {new Date().getFullYear()} شحتة للتجارة
          </p>
          <Link
            href="https://wa.me/201000094180"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/80 hover:text-primary transition-colors duration-200 underline"
          >
            Made With ❤️ By: Rafeeq.Academy Teams
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
