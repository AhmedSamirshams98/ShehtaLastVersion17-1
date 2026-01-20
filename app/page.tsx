import HomeFirst from "./components/HomeComponents/HomeFirst";
import HomeMarque from "./components/HomeComponents/HomeMarque";
import HomeAbout from "./components/HomeComponents/HomeAbout";
import HomeCars from "./components/HomeComponents/HomeCars";
import HomeHowtoOrder from "./components/HomeComponents/HomeHowtoOrder";
import HomeReels from "./components/HomeComponents/HomeReels";
import HomeClients from "./components/HomeComponents/HomeClients";

const page = () => {
  return (
    <div className="font-graphic text-[2vw] px-[6%]     overflow-hidden   flex flex-col gap-4  md:gap-2 items-center">
      <HomeFirst />
      <HomeMarque />
      <HomeAbout />
      <HomeCars />
      <HomeReels />
      <HomeClients />
      <HomeHowtoOrder />
    </div>
  );
};

export default page;
