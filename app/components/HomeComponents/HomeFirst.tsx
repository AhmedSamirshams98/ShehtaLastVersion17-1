import React from "react";
import backgroundimage from "../../../public/images/backgroundimage.png";
import Image from "next/image";
import "../../../app/components/styles/globals.css";
import { Button } from "../ui/Button";
import Link from "next/link";

const HomeFirst = () => {
  return (
    <div className="w-screen  relative    " style={{ direction: "rtl" }}>
      <Image
        className=" w-screen object-cover h-[45vh] md:h-auto font-bold  md:max-h-screen"
        src={backgroundimage}
        alt="shehtatradingcars"
        priority
      />
      <div
        className="absolute top-0 blur-[48px]  right-0 aspect-square  w-[30vw] md:w-[12vw] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, #0074FD 0%, #976E0000 100%)",
        }}
      ></div>
      <div className="flex flex-col    gap-4 md:gap-6 text-white text-right absolute top-[12vh] md:top-[14vh] lg:top-[16vh]   right-[7%]">
        <h1 className="text-[6vw] md:text-[4vw] font-bold ">
          سيـارة أحـلامـك!
          <br /> لحد باب البيت
        </h1>
        <Link href="/form" className="">
          <Button kind="primary">اطلب سيارتك الآن!</Button>
        </Link>{" "}
      </div>
    </div>
  );
};

export default HomeFirst;
