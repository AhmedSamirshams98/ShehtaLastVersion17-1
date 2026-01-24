"use client";

import React, { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "../emblaCarousel/EmblaCarousel";
import { useVideoStore } from "@/stores/videoStore";

interface Props {
  isDashboard?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (src: string) => void;
}

const HomeClients = ({ isDashboard, onDelete, onEdit }: Props) => {
  const clients = useVideoStore((state) => state.clients);
  const fetchClients = useVideoStore((state) => state.fetchClients);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const slides = clients.map((video) => (
    <div key={video.id} className="relative px-2">
      {isDashboard && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            onClick={() => onEdit?.(video.src)}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
          >
            تعديل
          </button>
          <button
            onClick={() => onDelete?.(video.id)}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
          >
            حذف
          </button>
        </div>
      )}

      <div className="aspect-[9/16] relative">
        <iframe
          src={video.src}
          className="absolute inset-0 w-full h-full rounded-[24px]"
          allowFullScreen
        />
      </div>
    </div>
  ));

  const options: EmblaOptionsType = {
    align: "center",
    containScroll: "trimSnaps",
  };

return (
  <section className="w-full py-10">
    {/* العنوان */}
    <h2 className="text-center text-2xl md:text-3xl font-bold mb-6">
      آراء العملاء
    </h2>

    {/* الكاروسيل */}
    <EmblaCarousel slides={slides} options={options} />
  </section>
);};

export default HomeClients;
