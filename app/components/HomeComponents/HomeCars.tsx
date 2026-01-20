"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import EmblaCarouselSlider from "../emblaCarouselSlider/EmblaCarouselSlider";
import "../emblaCarouselSlider/emblaCarouselSlider.css";
import "../emblaCarousel/emblaCarousel.css";
import whats from "@/public/images/whatsapp.svg";
import phone from "@/public/images/phonenumber.svg";
import EmblaCarousel from "../emblaCarousel/EmblaCarousel";
import Link from "next/link";
import { useCarStore } from "@/stores/carStore";
import { usePathname, useRouter } from "next/navigation";
import { Car } from "@/types/car";

interface HomeCarsProps {
  isDashboard?: boolean;
  onEditCar?: (car: Car) => void; // Use proper type instead of any
}

const HomeCars = ({ isDashboard = false, onEditCar }: HomeCarsProps) => {
  const router = useRouter();
  const { cars, fetchCars, deleteCar } = useCarStore();
  const pathname = usePathname();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function openDialer() {
    const userAgent = navigator.userAgent;

    if (userAgent.match(/Android|iPhone|iPad|iPod|Huawei|HarmonyOS/i)) {
      window.location.href = "tel:+201000030607";
    } else {
      alert(
        " هذه الميزة متاحة فقط على الأجهزة المحمولة.رقم الاتصال :+201000030607",
      );
    }
  }

  useEffect(() => {
    if (cars.length === 0) {
      fetchCars();
    }
  }, [fetchCars, cars.length]);

  // التحقق إذا كنا في الصفحة الرئيسية أو في الداشبورد
  const isHomePage = pathname === "/" && !isDashboard;

  // الحصول على جميع الـ brands الفريدة
  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand))).filter(
    (brand) => brand,
  );

  // تصفية السيارات حسب الـ brand المختار
  const filteredCars =
    selectedBrand === "all"
      ? cars
      : cars.filter((car) => car.brand === selectedBrand);

  const OPTIONS = {
    loop: true,
    duration: 20,
  };

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

  // دالة التعامل مع التعديل
  const handleEdit = (car: Car, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onEditCar) {
      onEditCar(car); // Pass the car data to parent component
    }
  };

  const aboutSlides = filteredCars.map((car) => {
    const carSlides = car.images.map((img, index) => (
      <div key={index} className="slider-slide object-cover">
        <Image
          src={img}
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
        id="cars"
        className=" p-[14px] bg-white rounded-[26px] overflow-hidden  shadow-lg flex flex-col"
      >
        {/* سلايدر صور السيارة */}
        <EmblaCarouselSlider slides={carSlides} options={{ loop: true }} />

        {/* تفاصيل السيارة */}
        <div className="w flex flex-col gap-2 mt-[3vh] w-full aspect-video">
          <h3 className="text-black font-semibold text-center text-[4vw] md:text-[2.5vw] lg:text-[1.4vw] xl:text-[1vw]">
            {car.model}
          </h3>
          <div className="flex justify-between">
            <h1 className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
              {car.brand}
            </h1>
            <div className="flex gap-4">
              <span className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
                {car.kilometers} KM
              </span>
              <span className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
                {car.year}
              </span>
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
          <button
            aria-label="carstatus"
            className="bg-[#E6E6E6] font-bold text-black rounded-[42.5px] w-[45%]  text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1"
          >
            {car.condition}
          </button>
          <Link
            href={`/cars/${car.id}`}
            className="bg-[#FDB800] font-bold text-black rounded-[42.5px] w-[45%]  text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1 flex items-center justify-center hover:bg-yellow-500 transition-colors"
          >
            قراءة المزيد
          </Link>
        </div>
        {isDashboard && (
          <div className="mt-2 flex gap-4 w-full ">
            <button
              aria-label="dashboard buttons "
              onClick={(e) => handleEdit(car, e)}
              className="bg-blue-500 text-white px-3 py-1 w-full rounded-[26px] hover:bg-blue-600"
            >
              تعديل
            </button>
            <button
              aria-label="dashboard buttons "
              onClick={async (e) => {
                e.stopPropagation(); // Prevent event bubbling
                if (confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
                  await deleteCar(car.id!);
                  // Optional: Refresh the page or redirect to dashboard after delete
                  if (pathname.includes("/cars/")) {
                    router.push("/dashboard"); // or wherever appropriate
                  }
                }
              }}
              className="bg-red-500 text-white px-3 py-1 w-full rounded-[26px] hover:bg-red-600"
            >
              حذف
            </button>
          </div>
        )}
      </div>
    );
  });

  return (
    <div
      className={`flex flex-col items-center overflow-hidden   gap-4 ${
        isHomePage ? "w-screen" : "w-full"
      } bg-[#FDB800]`}
      style={{ direction: "rtl" }}
    >
      <div className="px-[10%] mt-4 w-full flex flex-row justify-between items-center gap-4">
        <h1 className="text-[4vw] md:text-[3vw] lg:text-[1.8vw] font-bold text-center md:text-right text-gray-900">
          المعروضــات ✨
        </h1>

        {/* Dropdown فلتر الـ brands */}
        <div className="relative w-[35%] md:w-[25%]">
          {/* Dropdown Button */}
          <div className="relative ">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border w-full border-gray-300    rounded-[14px] p-1 text-[3vw] md:text-[1.2vw] lg:text-[0.9vw] font-medium text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2  justify-between"
            >
              <span className="text-[2.5vw] md:text-[1.5vw]">
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

            {isDropdownOpen && (
              <div className=" absolute top-full  mt-1 w-full bg-white border  border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredCars.length !== cars.length && (
                  <button
                    aria-label="all cars button"
                    onClick={() => handleBrandSelect("all")}
                    className={`w-full text-right p-2  text-[2.5vw] md:text-[1.2vw] hover:bg-gray-100 transition-colors ${
                      selectedBrand === "all"
                        ? "bg-gray-100 text-gray-800"
                        : "text-gray-700"
                    }`}
                  >
                    كل السيارات
                  </button>
                )}

                {uniqueBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full text-right px-4 py-2 text-[2.5vw] md:text-[1.2vw] hover:bg-gray-100 transition-colors ${
                      selectedBrand === brand
                        ? "bg-gray-100 text-gray-800"
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

      <div className="w-full relative flex items-center justify-center">
        {filteredCars.length > 0 ? (
          <EmblaCarousel slides={aboutSlides} options={OPTIONS} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد سيارات لعرضها</p>
            {selectedBrand !== "all" && (
              <button
                aria-label="all cars button"
                onClick={() => setSelectedBrand("all")}
                className="mt-2 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
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
    Volkswagen: "فولكس فاجن", // Check this line carefully
    Ford: "فورد",
    Mitsubishi: "ميتسوبيشي",
    Chevrolet: "شيفروليه",
    Nissan: "نيسان",
    Skoda: "سكودا",
    Jeep: "جيب",
    Seat: "سيات",
    Peugot: "بيجو",
    Fiat: "فيات",
    Peugeot: "بيجو",
    SEAT: "سيات",
    Renault: "رينو",
    Chery: "تشيري",
    Honda: "هوندا",
    BYD: "بي واي دي",
    Geely: "جيلي",
    MG: "ام جي",
    Golf: "جولف",
    Toyota: "تويوتا",
    Hyundai: "هيونداي",
    Kia: "كيا",
    BMW: "بي ام دبليو",
  };

  return brandMap[brand] || brand;
}

export default HomeCars;
