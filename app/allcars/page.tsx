"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react"; // Added useState
import whats from "../../public/images/whatsapp.svg";
import phone from "../../public/images/phonenumber.svg";
import { useCarStore } from "@/stores/carStore";
import Link from "next/link";
import EmblaCarouselSlider from "../components/emblaCarouselSlider/EmblaCarouselSlider";
import Router from "next/router";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const { cars, fetchCars } = useCarStore();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function openDialer() {
    const userAgent = navigator.userAgent;

    if (userAgent.match(/Android|iPhone|iPad|iPod|Huawei|HarmonyOS/i)) {
      window.location.href = "tel:+201000030607";
    } else {
      alert(
        " هذه الميزة متاحة فقط على الأجهزة المحمولة.رقم الاتصال :+201003060607",
      );
    }
  }

  // استدعاء البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // الحصول على جميع الـ brands الفريدة
  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand))).filter(
    (brand) => brand,
  );

  // تصفية السيارات حسب الـ brand المختار
  const filteredCars =
    selectedBrand === "all"
      ? cars
      : cars.filter((car) => car.brand === selectedBrand);

  // دالة لاختيار brand من الدروب داون
  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setIsDropdownOpen(false);
  };

  // دالة للحصول على الاسم المعروض للبراند المختار
  const getSelectedBrandDisplayName = () => {
    if (selectedBrand === "all") return "كل السيارات";
    return getBrandArabicName(selectedBrand);
  };

  return (
    <div
      className="min-h-screen px-[8%] lg:px-[16%] mt-[2%] mb-[2%]"
      style={{ direction: "rtl" }}
    >
      {/* Header with Filter Dropdown */}
      <div className="flex flex-row justify-between items-center mb-[6%] mt-[2%]">
        <h1 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-bold text-gray-900">
          المعروضــات ✨
        </h1>

        {/* Dropdown فلتر الـ brands */}
        <div className="relative w-[35%] md:w-[15%] ">
          {/* Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border w-full border-gray-300 rounded-lg p-2 text-[3vw] md:text-[1.2vw] lg:text-[0.9vw] font-medium text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2 justify-between"
            >
              <span className="text-[2.5vw] md:text-[1.5vw] lg:text-[1vw]">
                {getSelectedBrandDisplayName()}
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${
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

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {/* All Cars Option */}
                <button
                  onClick={() => handleBrandSelect("all")}
                  className={`w-full text-right p-3 text-[2.5vw] md:text-[1.2vw] hover:bg-gray-100 transition-colors ${
                    selectedBrand === "all"
                      ? "bg-gray-100 text-gray-800 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  كل السيارات
                </button>

                {/* Brand Options */}
                {uniqueBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full text-right p-3 text-[2.5vw] md:text-[1.2vw] hover:bg-gray-100 transition-colors ${
                      selectedBrand === brand
                        ? "bg-gray-100 text-gray-800 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {getBrandArabicName(brand)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* إغلاق الدروب داون عند النقر خارجها */}
          {isDropdownOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => {
            const carSlides = car.car_images.map((img, index) => (
              <div key={index} className="slider-slide object-cover">
                <Image
                  src={img.image_url}
                  fill
                  alt={`${car.brand} ${car.model}`}
                  className="object-cover w-full aspect-square rounded-[26px]"
                />
              </div>
            ));

            return (
              <div
                onClick={() => router.push(`/cars/${car.id}`)}
                key={car.id}
                className="p-[14px]  bg-white rounded-[26px] overflow-hidden shadow-lg flex flex-col items-center justify-center"
                style={{ direction: "ltr" }}
              >
                {/* سلايدر صور السيارة */}
                <EmblaCarouselSlider
                  slides={carSlides}
                  options={{ loop: true }}
                />

                {/* تفاصيل السيارة */}
                <div className="w flex flex-col gap-2 mt-[3vh] w-full aspect-video">
                  <h3 className="text-black font-semibold text-center text-[4vw] md:text-[2.5vw] lg:text-[1.4vw] xl:text-[1vw]">
                    {car.model}
                  </h3>
                  <div className="flex justify-between">
                    <h1 className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
                      {getBrandArabicName(car.brand)}
                    </h1>
                    <div className="flex gap-4">
                      <h1 className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
                        {car.kilometers} KM
                      </h1>
                      <h1 className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
                        {car.year}
                      </h1>
                    </div>
                  </div>
                  <p
                    style={{ direction: "rtl" }}
                    className="text-black text-justify text-[3vw] md:text-[1.5vw] lg:text-[1.5w] xl:text-[1vw] font-bold line-clamp-4"
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
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-[4vw] md:text-[2vw]">
              لا توجد سيارات لعرضها
            </p>
            {selectedBrand !== "all" && (
              <button
                onClick={() => setSelectedBrand("all")}
                className="mt-4 bg-[#FDB800] text-gray-800 px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors text-[3vw] md:text-[1.5vw]"
              >
                عرض كل المعروضات
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// دالة للحصول على الاسم العربي للـ brand
function getBrandArabicName(brand: string): string {
  const brandMap: { [key: string]: string } = {
    MercedesBenz: "مرسيدس",
    Audi: "اودي",
    Volkswagen: "فولكس فاجن",
    Ford: "فورد",
    Chevrolet: "شيفروليه",
    Nissan: "نيسان",
    Skoda: "سكودا",
    Jeep: "جيب",
    Seat: "سيات",
    Peugot: "بيجو",
    MG: "ام جي",
    Golf: "جولف",
  };

  return brandMap[brand] || brand;
}

export default Page;
