"use client";

import React, { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import "../emblaCarouselSlider/emblaCarouselSlider.css";
import EmblaCarousel from "../emblaCarousel/EmblaCarousel";
import { useVideoStore } from "@/stores/videoStore";

const HomeClients = () => {
  const clients = useVideoStore((state) => state.clients);
  const fetchClients = useVideoStore((state) => state.fetchClients);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  const slides = clients.map((video) => (
    <div key={video.id} className="flex justify-center px-2 h-full">
      <div className="relative w-full mx-auto">
        <div className="aspect-[9/16] w-full">
          <iframe
            src={video.src}
            className="absolute top-0 left-0 w-full h-full rounded-[24px] border-0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            scrolling="no"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  ));

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
        showViewAllButton={false}
      />
    </div>
  );
};

export default HomeClients;
