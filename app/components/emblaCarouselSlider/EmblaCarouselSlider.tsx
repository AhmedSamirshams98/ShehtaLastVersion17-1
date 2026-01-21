import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselSliderDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselSliderArrowButtons";

import "./emblaCarouselSlider.css";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname } from "next/navigation";

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
};

const EmblaCarouselSlider: React.FC<PropType> = (props) => {
  const pathname = usePathname();

  const aspectClass =
    pathname === "/" || pathname === "/allcars"
      ? "aspect-square"
      : "aspect-video";
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const maxDots = 5; // دائماً 5 نقاط كما طلبت

  // حساب النقاط المرئية بنظام إنستجرام
  const getVisibleDots = () => {
    const totalSlides = scrollSnaps.length;

    if (totalSlides <= maxDots) {
      // إذا كانت الصور أقل من أو تساوي 5، اعرض كل النقاط
      return Array.from({ length: totalSlides }, (_, i) => i);
    } else {
      // نظام إنستجرام: دائماً 5 نقاط تتحرك مع الشريط
      const currentSlide = selectedIndex;

      // احسب مجموعة النقاط المرئية بناءً على الموضع الحالي
      let startIndex = 0;

      if (currentSlide <= 2) {
        // في البداية: [0, 1, 2, 3, 4]
        startIndex = 0;
      } else if (currentSlide >= totalSlides - 2) {
        // في النهاية: [n-5, n-4, n-3, n-2, n-1]
        startIndex = totalSlides - maxDots;
      } else {
        // في المنتصف: [current-2, current-1, current, current+1, current+2]
        startIndex = currentSlide - 2;
      }

      return Array.from({ length: maxDots }, (_, i) => startIndex + i);
    }
  };

  // الحصول على النقاط المرئية
  const visibleDots = getVisibleDots();
  const totalSlides = scrollSnaps.length;

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="newslider">
      <div className="newslideview" ref={emblaRef}>
        <div className={`slidecontainer ${aspectClass} rounded-[26px]`}>
          {" "}
          {slides.map((slide, index) => (
            <div className="newslides " key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="controls mt-[1vh] w-full flex flex-row justify-between">
        <div className="s">
          <PrevButton
            className="w-[3vw] md:w-[2vw] lg:w-[1.5vw] xl:w-[1vw]"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          />
          <NextButton
            className="w-[3vw] md:w-[2vw] lg:w-[1.5vw] xl:w-[1vw]"
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          />
        </div>

        <div className="points flex items-center gap-1">
          {/* دائماً اعرض 5 نقاط */}
          {visibleDots.map((dotIndex) => (
            <DotButton
              key={dotIndex}
              onClick={() => onDotButtonClick(dotIndex)}
              className={`point ${
                selectedIndex === dotIndex ? "point--selected" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarouselSlider;
