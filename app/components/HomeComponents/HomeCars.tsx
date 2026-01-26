"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import EmblaCarouselSlider from "../emblaCarouselSlider/EmblaCarouselSlider";
import "../emblaCarouselSlider/emblaCarouselSlider.css";
import "../emblaCarousel/emblaCarousel.css";
import whats from "@/public/images/whatsapp.svg";
import phone from "@/public/images/phonenumber.svg";
import EmblaCarousel from "../emblaCarousel/EmblaCarousel";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HomeCarsProps {
  showAll?: boolean;
}

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: string;
  description: string;
  kilometers: number;
  price?: number;
  status: string;
  car_images: Array<{ id: number; image_url: string; car_id: number }>;
  images?: string[];
}

const HomeCars: React.FC<HomeCarsProps> = ({ showAll = false }) => {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // حالات التحميل التدريجي
  const [cars, setCars] = useState<Car[]>([]);
  const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);

  // مراجع للتحكم في الـ Carousel
  const emblaApiRef = useRef<any>(null);
  const isFetchingRef = useRef<boolean>(false);

  function openDialer() {
    const userAgent = navigator.userAgent;
    if (userAgent.match(/Android|iPhone|iPad|iPod|Huawei|HarmonyOS/i)) {
      window.location.href = "tel:+201000030607";
    } else {
      alert(
        "هذه الميزة متاحة فقط على الأجهزة المحمولة. رقم الاتصال :+201000030607",
      );
    }
  }

  // دالة لاستقبال Embla API
  const handleEmblaInit = (api: any) => {
    emblaApiRef.current = api;

    if (api) {
      // إضافة مستمع لحدث التمرير
      api.on("scroll", () => {
        checkIfNearEnd();
      });
    }
  };

  // التحقق إذا كان المستخدم قريب من النهاية
  const checkIfNearEnd = useCallback(() => {
    if (!emblaApiRef.current || isLoading || !hasMore || isFetchingRef.current)
      return;

    const api = emblaApiRef.current;
    const slideCount = api.slideNodes().length;
    const currentIndex = api.selectedScrollSnap();

    // إذا كان المستخدم في آخر 3 سلايدات، قم بتحميل المزيد
    if (currentIndex >= slideCount - 3) {
      loadMoreCars();
    }
  }, [isLoading, hasMore]);

  // دالة لتحميل السيارات من API
  const fetchCars = useCallback(
    async (pageNum: number = 1, loadMore: boolean = false) => {
      if (isLoading || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        // تحديد الـ API بناءً على showAll
        const apiUrl = showAll
          ? `/api/cars?page=${pageNum}&limit=10`
          : `/api/cars/available?page=${pageNum}&limit=10&status=available`; // نضيف فلتر للسيارات المتاحة

        const response = await fetch(apiUrl);
        const data = await response.json();

        const newCars = data.data;

        if (loadMore) {
          // عند التحميل الإضافي
          setCars((prev) => [...prev, ...newCars]);
          setDisplayedCars((prev) => [...prev, ...newCars]);
        } else {
          // عند التحميل الأول أو تغيير الفلتر
          setCars(newCars);
          setDisplayedCars(newCars);
        }

        setTotalCars(data.pagination.total);
        setHasMore(data.pagination.page < data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [isLoading, showAll],
  );

  // دالة لتحميل المزيد تلقائياً
  const loadMoreCars = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return;

    const nextPage = currentPage + 1;
    await fetchCars(nextPage, true);
  }, [hasMore, currentPage, fetchCars]);

  // التحميل الأول
  useEffect(() => {
    fetchCars(1, false);
  }, []);

  // فلترة السيارات حسب الـ Brand
  const filteredCars =
    selectedBrand === "all"
      ? displayedCars
      : displayedCars.filter((car) => car.brand === selectedBrand);

  // الحصول على الـ Brands الفريدة
  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand))).filter(
    Boolean,
  );

  // دالة لاختيار brand من الدروب داون
  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setIsDropdownOpen(false);
    setCurrentPage(1);
    setHasMore(true);

    if (brand === "all") {
      setDisplayedCars(cars);
    } else {
      setDisplayedCars(cars.filter((car) => car.brand === brand));
    }

    // العودة للسيارة الأولى عند تغيير الفلتر
    if (emblaApiRef.current) {
      setTimeout(() => {
        emblaApiRef.current?.scrollTo(0);
      }, 100);
    }
  };

  const getSelectedBrandDisplayName = () => {
    if (selectedBrand === "all") return "كل السيارات";
    return selectedBrand;
  };

  // إنشاء السلايدات للـ Carousel
  const aboutSlides = filteredCars.map((car) => {
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
        className="p-[14px] bg-white w-full h-full rounded-[26px] overflow-hidden shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow duration-300"
      >
        {/* سلايدر صور السيارة */}
        <EmblaCarouselSlider slides={carSlides} options={{ loop: true }} />

        {/* تفاصيل السيارة */}
        <div className="flex flex-col gap-2 mt-[3vh] w-full">
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
            className="text-black text-justify text-[3vw] md:text-[1.5vw] lg:text-[1.5vw] xl:text-[1vw] font-bold line-clamp-4"
          >
            {car.description}
          </p>
        </div>
        <div className="flex flex-row justify-between gap-2 items-center w-full mt-4">
          <Link
            href={`https://wa.me/201000030607?text=${encodeURIComponent(
              `السلام عليكم عندي استفسار بخصوص سيارة ${car.model}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="w-[8vw] md:w-[4vw] lg:w-[2vw] cursor-pointer hover:scale-110 transition-transform"
              src={whats}
              alt="whatsapp"
            />
          </Link>

          <Image
            onClick={openDialer}
            className="w-[8vw] md:w-[4vw] lg:w-[2vw] cursor-pointer hover:scale-110 transition-transform"
            src={phone}
            alt="phone"
          />
          <button
            aria-label="carstatus"
            className="bg-[#E6E6E6] font-bold text-black rounded-[42.5px] w-[45%] text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1"
          >
            {car.condition}
          </button>
          <Link
            href={`/cars/${car.id}`}
            className="bg-[#FDB800] font-bold text-black rounded-[42.5px] w-[45%] text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1 flex items-center justify-center hover:bg-yellow-500 transition-colors"
          >
            قراءة المزيد
          </Link>
        </div>
      </div>
    );
  });

  const OPTIONS = {
    loop: false, // تعطيل الـ loop للسماح بإضافة عناصر جديدة
    duration: 20,
    align: "start" as const,
  };

  return (
    <div
      className="flex flex-col items-center overflow-hidden gap-4 w-screen bg-[#FDB800] pb-8"
      style={{ direction: "rtl" }}
    >
      <div className="px-[6%] lg:px-0 mt-4 w-full md:w-[70%] flex flex-row justify-between items-center gap-4">
        <h1 className="text-[4vw] md:text-[3vw] lg:text-[1.4vw] font-bold text-center md:text-right text-gray-900">
          {showAll ? "كل المعروضات" : "أحدث المعروضــات ✨"}
        </h1>

        {/* Dropdown فلتر الـ brands */}
        <div className="relative w-[35%] md:w-[20%]">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border w-full border-gray-300 rounded-[14px] p-1 text-[3vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2 justify-between"
            >
              <span className="text-[2.5vw] md:text-[1.5vw] lg:text-[1vw] p-1">
                {getSelectedBrandDisplayName()}
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
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
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                <button
                  aria-label="all cars button"
                  onClick={() => handleBrandSelect("all")}
                  className={`w-full text-right font-semibold p-2 text-[2.5vw] md:text-[1.2vw] lg:text-[1vw] hover:bg-gray-100 transition-colors ${
                    selectedBrand === "all"
                      ? "bg-gray-100 text-gray-800"
                      : "text-gray-700"
                  }`}
                >
                  كل السيارات
                </button>
                {uniqueBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full font-semibold text-right px-4 py-2 text-[2.5vw] md:text-[1.2vw] lg:text-[1vw] hover:bg-gray-100 transition-colors ${
                      selectedBrand === brand
                        ? "bg-gray-100 text-gray-800"
                        : "text-gray-700"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isDropdownOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      </div>

      <div className="w-full relative flex flex-col items-center justify-center">
        {aboutSlides.length > 0 ? (
          <>
            <div className="w-full">
              <EmblaCarousel
                slides={aboutSlides}
                options={OPTIONS}
                onEmblaInit={handleEmblaInit}
                showViewAllButton={true}
              />
            </div>

            {/* Spinner للتحميل */}
            {isLoading && (
              <div className="mt-4 flex flex-col items-center justify-center">
                <div className="relative">
                  <svg
                    className="w-12 h-12 text-[#FDB800] animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 mt-2 text-[2.5vw] md:text-[1.2vw] lg:text-[0.8vw]">
                  جاري تحميل المزيد من السيارات...
                </p>
              </div>
            )}

            {/* مؤشر التقدم */}
          </>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#FDB800] animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="mt-3 text-gray-600">جاري تحميل السيارات...</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد سيارات لعرضها</p>
            {selectedBrand !== "all" && (
              <button
                aria-label="all cars button"
                onClick={() => handleBrandSelect("all")}
                className="mt-2 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-[3vw] md:text-[1.5vw] lg:text-[1vw]"
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

export default HomeCars;
