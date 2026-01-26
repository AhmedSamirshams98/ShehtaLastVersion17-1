"use client";
import React, { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  showViewAllButton?: boolean; 
  onEmblaInit?: (api: any) => void;
};

import "./emblaCarousel.css";
import { Button } from "../ui/Button";
import Link from "next/link";

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, showViewAllButton = true, onEmblaInit } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // تمرير emblaApi إلى المكون الأب عندما يتوفر
  useEffect(() => {
    if (emblaApi && onEmblaInit) {
      onEmblaInit(emblaApi);
    }
  }, [emblaApi, onEmblaInit]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          
          {/* زر عرض الكل - إعادته كما كان */}
          {showViewAllButton && (
            <Link
              className="w-full relative flex justify-center"
              href="/allcars"
            >
              <Button kind="secondarySpecial">عرض الكل</Button>
            </Link>
          )}

          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;