import Marquee from "react-fast-marquee";
import marque1 from "../../../public/images/marque1.webp";

import Image from "next/image";

const HomeMarque = () => {
  return (
    <div className="text-white  w-[87%] md:w-[70%] lg:w-[78%] mt-[1%] mb-[1%]  flex flex-col  ">
      <Marquee direction="left" speed={40} pauseOnHover={true}>
        <Image
          quality={50}
          className="w-full"
          src={marque1}
          alt="shehtaTrading Cars Logo"
        />
      </Marquee>
    </div>
  );
};

export default HomeMarque;
