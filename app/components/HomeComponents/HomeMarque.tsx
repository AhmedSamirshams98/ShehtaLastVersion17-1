import React from "react";
import Marquee from "react-fast-marquee";
import marque1 from "../../../public/images/marque1.webp";
import marque2 from "../../../public/images/marque2.webp";
import marque3 from "../../../public/images/marque3.webp";
import Image from "next/image";

const HomeMarque = () => {
  return (
    <div className="text-white  w-screen flex flex-col gap-4  ">
      <Marquee direction="left" speed={40} pauseOnHover={true}>
        <Image
          quality={50}
          className="w-full"
          src={marque1}
          alt="shehtaTrading Cars Logo"
        />
      </Marquee>
      <Marquee direction="right" speed={50} pauseOnHover={true}>
        <Image
          quality={50}
          className="w-full"
          src={marque2}
          alt="shehtaTrading Cars Logo"
        />
      </Marquee>
      <Marquee direction="left" speed={60} pauseOnHover={true}>
        <Image
          quality={50}
          className="w-full"
          src={marque3}
          alt="shehtaTrading Cars Logo"
        />
      </Marquee>
    </div>
  );
};

export default HomeMarque;
