"use client";
import React, { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaSliderDotButton";

import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
};

const EmblaSlider: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  // Reinitialize slider when content changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [slides, emblaApi]);

  return (
    <section className="slider-container">
      <div className="slider-viewport" ref={emblaRef}>
        <div className="slider-track">
          {slides.map((slide, index) => (
            <div className="slider-slide" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="slider-controls flex justify-center">
        <div className="slider-dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"slider-dot".concat(
                index === selectedIndex ? " slider-dot--active" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaSlider;
