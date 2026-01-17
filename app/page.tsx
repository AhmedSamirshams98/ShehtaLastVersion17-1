import React from "react";
import HomeFirst from "./components/HomeComponents/HomeFirst";
import HomeMarque from "./components/HomeComponents/HomeMarque";
import HomeAbout from "./components/HomeComponents/HomeAbout";
import HomeCars from "./components/HomeComponents/HomeCars";
import HomeHowtoOrder from "./components/HomeComponents/HomeHowtoOrder";
import HomeReels from "./components/HomeComponents/HomeReels";

const page = () => {
  return (
    <div className="font-graphic text-[2vw] px-[10%] md:px-[6%]    overflow-hidden   flex flex-col gap-4 items-center">
      <HomeFirst />
      <HomeMarque />
      <HomeAbout />
      <HomeCars />
            <HomeReels />

      <HomeHowtoOrder />
    </div>
  );
};

export default page;
