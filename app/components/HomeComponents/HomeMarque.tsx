import React from "react";
import Marquee from "react-fast-marquee";
import marque1 from "../../../public/images/marque1.png";
import marque2 from "../../../public/images/marque2.png";
import marque3 from "../../../public/images/marque3.png";
import Image from "next/image";

const HomeMarque = () => {
  return (
    <div className="text-white  w-screen flex flex-col gap-4  ">
      <Marquee direction="left" speed={40} pauseOnHover={true}>
        <Image className="w-full" height={32} src={marque1} alt="shehtaTrading Cars Logo" />
      </Marquee>
      <Marquee direction="right" speed={50} pauseOnHover={true}>
        <Image className="w-full" height={32} src={marque2} alt="shehtaTrading Cars Logo" />
      </Marquee>
      <Marquee direction="left" speed={60} pauseOnHover={true}>
        <Image className="w-full" height={32} src={marque3} alt="shehtaTrading Cars Logo" />
      </Marquee>
    </div>
  );
};

export default HomeMarque;
