"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import whats from "../../../public/images/whatsapp.svg";
import phone from "../../../public/images/phonenumber.svg";
import Image from "next/image";
import { Button } from "../../components/ui/Button";
import { useCarStore } from "@/stores/carStore";
import EmblaCarouselSlider from "../../components/emblaCarouselSlider/EmblaCarouselSlider";
import "../../components/emblaCarouselSlider/emblaCarouselSlider.css";
import Link from "next/link";

const CarDetailsPage = () => {
  const params = useParams();
  const carId = Number(params.id);
  const { currentCar, fetchCarById, loading } = useCarStore();
  const [isOpen, setIsOpen] = useState(false);
  console.log(currentCar)

  useEffect(() => {
    if (carId) {
      fetchCarById(carId);
    }
  }, [carId, fetchCarById]);

  function openDialer() {
    const userAgent = navigator.userAgent;

    if (userAgent.match(/Android|iPhone|iPad|iPod|Huawei|HarmonyOS/i)) {
      window.location.href = "tel:+201000030607";
    } else {
      alert(
        " هذه الميزة متاحة فقط على الأجهزة المحمولة.رقم الاتصال :+201000030607"
      );
    }
  }
    const getCarUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  // Generate WhatsApp message with car link
  const generateWhatsAppMessage = () => {
    const carUrl = getCarUrl();
    
    if (!currentCar) {
      return `السلام عليكم 🌹\n\nعندي استفسار بخصوص سيارة\n\nرابط السيارة على الموقع:\n${carUrl}`;
    }
    
    const carInfo = `${currentCar.brand} ${currentCar.model} ${currentCar.year}`;
    
    return `السلام عليكم 🌹\n\nعندي استفسار بخصوص سيارة:\n${carInfo}\n\nرابط السيارة على الموقع:\n${carUrl}`;
  };
  // عمل map على الصور لإنشاء slides للـ carousel
  const carSlides =
    currentCar?.images?.map((img, index) => (
      <div key={index} className="slider-slide  ">
        <Image
          src={img}
          fill
          alt={`${currentCar.brand} ${currentCar.model} - صورة ${index + 1}`}
          className="  rounded-[26px]  object-cover "
        />
      </div>
    )) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentCar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">السيارة غير موجودة</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen px-[8%] mt-[2%] mb-[2%] flex flex-col items-center gap-2">
      <h1 className="text-[3vw] md:text-[2vw] text-[#000000]">
        {currentCar.brand} {currentCar.model}
      </h1>

      <h1 className="text-center text-[2.5vw] md:text-[1.3vw] font-medium">
        🤲 بفضل ونعمة من الله 🤲
        <br />
        #شحتة_للتجارة {currentCar.brand} {currentCar.model}
      </h1>

      {/* معلومات السيارة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full" dir="rtl">
        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            ماركة السيارة :
          </label>
          <h1 className="rounded-[34px] text-[4vw] md:text-[1.2vw] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium">
            {currentCar.brand}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            موديل السيارة :
          </label>
          <h1 className="rounded-[34px] text-[4vw] md:text-[1.2vw] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium">
            {currentCar.model}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            سنة الصنع :
          </label>
          <h1 className="rounded-[34px] text-[4vw] md:text-[1.2vw] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium">
            {currentCar.year}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            عداد السيارة :
          </label>
          <h1 className="rounded-[34px] text-[4vw] md:text-[1.2vw] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium">
            {currentCar.kilometers} KM
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            حالة السيارة :
          </label>
          <h1 className="rounded-[34px] text-[4vw] md:text-[1.2vw] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium">
            {currentCar.condition}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            امكانية الطلب :
          </label>
          <h1 className="rounded-[34px] text-[4vw] md:text-[1.2vw] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium">
            {currentCar.status === "available" ? "متاح" : "محجوز"}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            للمزيد من التفاصيل :
          </label>
          <button className="relative text-[4vw] md:text-[1.2vw] rounded-[34px] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium flex flex-row justify-center items-center w-full hover:bg-gray-50 transition-colors">
            تواصل واتساب
            <Link
              className="absolute left-2 h-full md:w-[3vw] flex items-center lg:w-[1.5vw]"
              href={`https://wa.me/201000030607?text=${encodeURIComponent(
                generateWhatsAppMessage()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="w-[6vw] md:w-[4vw] lg:w-[2vw] cursor-pointer"
                src={whats}
                alt="whatsapp"
              />
            </Link>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[4vw] md:text-[1.2vw] font-medium">
            للمزيد من التفاصيل :
          </label>
          <button onClick={openDialer} className="relative rounded-[34px] text-[4vw] md:text-[1.2vw] bg-white text-black border-[1px] border-[#ffffff] p-[2%] text-center font-medium flex flex-row justify-center items-center w-full hover:bg-gray-50 transition-colors">
            تواصل هاتفياً
            <Image
              className="absolute left-2 h-full md:w-[3vw] lg:w-[1.5vw]"
              src={phone}
              alt="رقم اتصال شحتة للتجاره"
            />
          </button>
        </div>
        <div className="text-right flex flex-col col-span-1 md:col-span-4 w-full gap-1">
          <h2 className="text-[4vw] md:text-[1.2vw] font-medium text-black mb-1">
            وصف السيارة
          </h2>
          <p
            className="text-[4vw] md:text-[1.2vw] font-medium text-justify  leading-relaxed bg-white p-[2%] rounded-2xl"
            style={{ direction: "rtl" }}
          >
            {currentCar.description}
          </p>
        </div>
      </div>

      {/* الوصف */}

      <div onClick={() => setIsOpen(true)} className="w-full cursor-pointer">
        <EmblaCarouselSlider slides={carSlides} options={{ loop: true }} />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 overflow-y-scroll hide-scrollbar backdrop-blur-lg flex items-center justify-center z-[80]"
          onClick={() => setIsOpen(false)}
        >
          {/* Container with relative positioning for the X button */}
          <div className="relative mt-[16%] w-[80vw] lg:w-[50vw] flex items-center justify-center">
            {/* زر الإغلاق - positioned relative to the slider container */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10  right-0 z-20 text-black rounded-full text-[4vw] md:text-[1.5vw] lg:text-[1vw] transition hover:bg-white/20 p-2"
            >
              ✕
            </button>

            {/* السلايدر */}
            <div
              className="w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <EmblaCarouselSlider slides={carSlides} />
            </div>
          </div>
        </div>
      )}

      <Button kind="secondary">اطلبها الآن!</Button>
    </div>
  );
};

export default CarDetailsPage;
