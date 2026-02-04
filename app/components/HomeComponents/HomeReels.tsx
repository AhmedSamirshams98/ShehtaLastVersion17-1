"use client";

import React, { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "../emblaCarousel/EmblaCarousel";
import { useVideoStore } from "@/stores/videoStore";

interface Props {
  isDashboard?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (src: string) => void;
  onMakeLatest?: (id: number) => void; // <-- جديد
}

const HomeReels = ({ isDashboard, onDelete, onEdit , onMakeLatest  }: Props) => {
  const reels = useVideoStore((state) => state.reels);
  const fetchReels = useVideoStore((state) => state.fetchReels);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const slides = reels.map((reel) => (
    <div key={reel.id} className="relative px-2">
      {isDashboard && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            onClick={() => onEdit?.(reel.src)}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
          >
            تعديل
          </button>
          <button
            onClick={() => onDelete?.(reel.id)}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
          >
            حذف
          </button>
          <button
            onClick={() => onMakeLatest?.(reel.id)} // <-- جديد
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
          >
            اجعله الأحدث
          </button>
        </div>
      )}

      <div className="aspect-[9/16] relative">
        <iframe
          src={reel.src}
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
        أحدث الفيديوهات
      </h2>

      {/* الكاروسيل */}
      <EmblaCarousel slides={slides} options={options} />
    </section>
  );
};
export default HomeReels;
