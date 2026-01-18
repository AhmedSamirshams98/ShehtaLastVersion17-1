import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import "../emblaCarouselSlider/emblaCarouselSlider.css";
import EmblaCarousel from "../emblaCarousel/EmblaCarousel";

const HomeClients = () => {
  const reels = [
    {
      id: 1,
      src: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1377447616739465%2F&show_text=false&width=267&t=0",
      title: "Reel 2",
    },
    {
      id: 2,
      src: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1281445033801749%2F&show_text=false&width=267&t=0",
      title: "Reel 3",
    },
  ];

  // Convert reels to slides for EmblaSlider
  const slides = reels.map((reel) => (
    <div key={reel.id} className="flex justify-center px-2 h-full">
      <div className="relative w-full mx-auto">
        <div className="aspect-[9/16] w-full">
          <iframe
            src={reel.src}
            className="absolute top-0 left-0 w-full h-full rounded-[24px] border-0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title={reel.title}
            loading="lazy"
            allowFullScreen
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </div>
  ));

  // Embla carousel options
  const emblaOptions: EmblaOptionsType = {
    align: "center",
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
  };

  return (
    <div id="clients" className="w-full mb-[10%]">
      <h2 className="font-bold text-center text-[4vw] md:text-[2vw] mb-6 mt-2">
        آراء العملاء
      </h2>

      <EmblaCarousel
        slides={slides}
        options={emblaOptions}
        showViewAllButton={false} // Hide the "عرض الكل" button
      />
    </div>
  );
};

export default HomeClients;
