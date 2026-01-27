"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import whats from "../../public/images/whatsapp.svg";
import phone from "../../public/images/phonenumber.svg";
import { useCarStore } from "@/stores/carStore";
import Link from "next/link";
import EmblaCarouselSlider from "../components/emblaCarouselSlider/EmblaCarouselSlider";

const AvailableCarsPage = () => {
  const { availableCars, fetchAvailableCars, availableCarsHasMore } = useCarStore();

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [visibleCars, setVisibleCars] = useState(8); // أول 8 سيارات

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchAvailableCars();
  }, [fetchAvailableCars]);

  // ✅ السيارات المتاحة فقط
  // const availableCars = cars.filter((car) => car.status === "available");

  // ✅ الماركات فقط من السيارات المتاحة
  const uniqueBrands = Array.from(
    new Set(availableCars.map((car) => car.brand)),
  );

  // ✅ فلترة حسب الماركة
  const filteredCars = selectedBrand
    ? availableCars.filter((car) => car.brand === selectedBrand)
    : availableCars;

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setIsDropdownOpen(false);
  };

  const getSelectedBrandDisplayName = () => {
    return selectedBrand ? getBrandArabicName(selectedBrand) : "اختر الماركة";
  };

  function openDialer() {
    const ua = navigator.userAgent;
    if (ua.match(/Android|iPhone|iPad|iPod|Huawei|HarmonyOS/i)) {
      window.location.href = "tel:+201000030607";
    } else {
      alert("الميزة متاحة على الموبايل فقط");
    }
  }

  return (
    <div
      className="min-h-screen px-[8%] mt-[2%] mb-[2%]"
      style={{ direction: "rtl" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10 mt-10">
        <h1 className="text-[4vw] md:text-[3vw] lg:text-[1.5vw] font-bold">
          السيارات المتاحة 🚗
        </h1>

        {/* Dropdown */}
        <div className="relative w-[40%] md:w-[20%] lg:w-[15%]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border rounded-lg p-2 flex justify-between items-center"
          >
            <span>{getSelectedBrandDisplayName()}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full w-full bg-white border rounded-lg shadow z-10">
              {uniqueBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandSelect(brand)}
                  className="block w-full text-right p-2 hover:bg-gray-100"
                >
                  {getBrandArabicName(brand)}
                </button>
              ))}
            </div>
          )}

          {isDropdownOpen && (
            <div
              className="fixed inset-0"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCars.length > 0 ? (
          filteredCars.slice(0, visibleCars).map((car) => {
            const slides = car.car_images.map((img, i) => (
              <div key={i} className="relative w-full aspect-square">
                <Image
                  src={img.image_url}
                  fill
                  alt={car.model}
                  className="object-cover rounded-[26px]"
                />
              </div>
            ));

            return (
              <div
                key={car.id}
                className="bg-white p-4 rounded-[26px] shadow"
                style={{ direction: "ltr" }}
              >
                <EmblaCarouselSlider slides={slides} options={{ loop: true }} />

                <div className="mt-4 space-y-2 aspect-video">
                  <h3 className="text-center font-bold text-lg">{car.model}</h3>

                  <div className="flex justify-between text-sm">
                    <span>{getBrandArabicName(car.brand)}</span>
                    <span>{car.year}</span>
                    <span>{car.kilometers} KM</span>
                  </div>

                  <p
                    style={{ direction: "rtl" }}
                    className="text-sm line-clamp-3"
                  >
                    {car.description}
                  </p>
                </div>

                <div className="flex flex-row justify-between gap-2 items-center w-full">
                  <Link
                    href={`https://wa.me/201000030607?text=${encodeURIComponent(
                      `السلام عليكم عندي استفسار بخصوص سيارة ${car.model}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      className="w-[8vw] md:w-[4vw] lg:w-[2vw] cursor-pointer"
                      src={whats}
                      alt="whatsapp"
                    />
                  </Link>
                  <Image
                    onClick={openDialer}
                    className="w-[8vw] md:w-[4vw] lg:w-[2vw]"
                    src={phone}
                    alt="phone"
                  />
                  <button className="bg-[#E6E6E6] font-bold text-black rounded-[42.5px] w-[45%]  text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1">
                    {car.condition}
                  </button>
                  <Link
                    href={`/cars/${car.id}`}
                    className="bg-[#FDB800] font-bold text-black rounded-[42.5px] w-[45%]  text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1 flex items-center justify-center hover:bg-yellow-500 transition-colors"
                  >
                    قراءة المزيد
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            لا توجد سيارات متاحة
          </p>
        )}
      </div>
      {visibleCars < filteredCars.length || availableCarsHasMore ? (
  <div className="flex justify-center mt-6">
    <button
      onClick={async () => {
        if (visibleCars < filteredCars.length) {
          // فقط إظهار المزيد من السيارات المحلية
          setVisibleCars(prev => prev + 8);
        } else if (availableCarsHasMore) {
          // تحميل سيارات إضافية من API
          await fetchAvailableCars(true);
          setVisibleCars(prev => prev + 8);
        }
      }}
      className="bg-[#FDB800] text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors"
    >
      عرض المزيد
    </button>
  </div>
) : null}

    </div>
  );
};

// 🔹 ترجمة الماركات
function getBrandArabicName(brand: string): string {
  const map: Record<string, string> = {
    MercedesBenz: "مرسيدس",
    Audi: "أودي",
    Volkswagen: "فولكس فاجن",
    Ford: "فورد",
    Chevrolet: "شيفروليه",
    Nissan: "نيسان",
    Skoda: "سكودا",
    Jeep: "جيب",
    Seat: "سيات",
    Peugot: "بيجو",
    MG: "إم جي",
    Golf: "جولف",
  };

  return map[brand] || brand;
}

export default AvailableCarsPage;
