import React from "react";
import { Button } from "../ui/Button";
import Link from "next/link";

const HomeFirst = () => {
  return (
    <section
      dir="rtl"
      className="relative w-screen h-[45vh] md:h-screen  bg-cover bg-center"
      style={{
        backgroundImage: "url(/images/backgroundimage.jpg)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-[30vw] md:w-[12vw] aspect-square
        blur-[24px] opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, #0074FD 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="absolute top-1/3 md:top-1/4 lg:top-1/3 -translate-y-1/2 right-[7%] lg:right-[16%] text-white text-right flex flex-col gap-4 md:gap-6">
        <h1 className="text-[6vw] md:text-[4vw] xl:text-[3vw] font-bold leading-tight">
          سيـارة أحـلامـك!
          <br /> لحد باب البيت
        </h1>

        <Link href="/form" aria-label="اطلب سيارتك الان">
          <Button kind="primary" aria-label="اطلب سيارتك الآن">
            اطلب سيارتك الآن!
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HomeFirst;
