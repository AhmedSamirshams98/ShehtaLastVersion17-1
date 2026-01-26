  // "use client";
  // import React, { useEffect, useState } from "react";
  // import Image from "next/image";

  // import EmblaCarouselSlider from "../emblaCarouselSlider/EmblaCarouselSlider";
  // import "../emblaCarouselSlider/emblaCarouselSlider.css";
  // import "../emblaCarousel/emblaCarousel.css";
  // import whats from "@/public/images/whatsapp.svg";
  // import phone from "@/public/images/phonenumber.svg";
  // import EmblaCarousel from "../emblaCarousel/EmblaCarousel";
  // import Link from "next/link";
  // import { useCarStore } from "@/stores/carStore";
  // import { useRouter } from "next/navigation";

  // interface HomeCarsProps {
  //   showAll?: boolean;
  // }

  // const HomeCars: React.FC<HomeCarsProps> = ({ showAll = false }) => {
  //   const router = useRouter();
  //   const { availableCars, fetchAvailableCars, cars, fetchCars } = useCarStore();
  //   const [selectedBrand, setSelectedBrand] = useState<string>("all");
  //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //   function openDialer() {
  //     const userAgent = navigator.userAgent;

  //     if (userAgent.match(/Android|iPhone|iPad|iPod|Huawei|HarmonyOS/i)) {
  //       window.location.href = "tel:+201000030607";
  //     } else {
  //       alert(
  //         " هذه الميزة متاحة فقط على الأجهزة المحمولة.رقم الاتصال :+201000030607",
  //       );
  //     }
  //   }
  //   useEffect(() => {
  //     if (showAll) {
  //       if (!cars || cars.length === 0) fetchCars();
  //     } else {
  //       if (!availableCars || availableCars.length === 0) fetchAvailableCars();
  //     }
  //   }, [showAll, fetchAvailableCars, fetchCars]);

  //   const carsToShow = showAll ? cars : availableCars;

  //   const uniqueBrands = Array.from(
  //     new Set(carsToShow?.map((car) => car.brand)),
  //   ).filter(Boolean);

  //   const filteredCars =
  //     selectedBrand === "all"
  //       ? carsToShow
  //       : carsToShow.filter((car) => car.brand === selectedBrand);

  //   const OPTIONS = {
  //     loop: true,
  //     duration: 20,
  //   };

  //   // دالة لاختيار brand من الدروب داون
  //   const handleBrandSelect = (brand: string) => {
  //     setSelectedBrand(brand);
  //     setIsDropdownOpen(false);
  //   };

  //   const getSelectedBrandDisplayName = () => {
  //     if (selectedBrand === "all") return "كل السيارات";
  //     return selectedBrand;
  //   };

  //   const aboutSlides = filteredCars?.map((car) => {
  //     const carSlides = car.car_images.map((img, index) => (
  //       <div key={index} className="slider-slide object-cover">
  //         <Image
  //           src={img.image_url}
  //           fill
  //           alt={`${car.brand} ${car.model}`}
  //           className="object-cover w-full aspect-square rounded-[26px]"
  //         />
  //       </div>
  //     ));

  //     return (
  //       <div
  //         onClick={() => router.push(`/cars/${car.id}`)}
  //         key={car.id}
  //         id="cars"
  //         className=" p-[14px] bg-white rounded-[26px] overflow-hidden  shadow-lg flex flex-col"
  //       >
  //         {/* سلايدر صور السيارة */}
  //         <EmblaCarouselSlider slides={carSlides} options={{ loop: true }} />

  //         {/* تفاصيل السيارة */}
  //         <div className="w flex flex-col gap-2 mt-[3vh] w-full aspect-video">
  //           <h3 className="text-black font-semibold text-center text-[4vw] md:text-[2.5vw] lg:text-[1.4vw] xl:text-[1vw]">
  //             {car.model}
  //           </h3>
  //           <div className="flex justify-between">
  //             <h1 className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
  //               {car.brand}
  //             </h1>
  //             <div className="flex gap-4">
  //               <span className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
  //                 {car.kilometers} KM
  //               </span>
  //               <span className="text-black text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] font-medium">
  //                 {car.year}
  //               </span>
  //             </div>
  //           </div>
  //           <p
  //             style={{ direction: "rtl" }}
  //             className="text-black text-justify text-[3vw] md:text-[1.5vw] lg:text-[1.5w] xl:text-[1vw] font-bold line-clamp-4"
  //           >
  //             {car.description}
  //           </p>
  //         </div>
  //         <div className="flex flex-row justify-between gap-2 items-center w-full">
  //           <Link
  //             href={`https://wa.me/201000030607?text=${encodeURIComponent(
  //               `السلام عليكم عندي استفسار بخصوص سيارة ${car.model}`,
  //             )}`}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //           >
  //             <Image
  //               className="w-[8vw] md:w-[4vw] lg:w-[2vw] cursor-pointer"
  //               src={whats}
  //               alt="whatsapp"
  //             />
  //           </Link>

  //           <Image
  //             onClick={openDialer}
  //             className="w-[8vw] md:w-[4vw] lg:w-[2vw]"
  //             src={phone}
  //             alt="phone"
  //           />
  //           <button
  //             aria-label="carstatus"
  //             className="bg-[#E6E6E6] font-bold text-black rounded-[42.5px] w-[45%]  text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1"
  //           >
  //             {car.condition}
  //           </button>
  //           <Link
  //             href={`/cars/${car.id}`}
  //             className="bg-[#FDB800] font-bold text-black rounded-[42.5px] w-[45%]  text-[3vw] md:text-[1.5vw] xl:text-[1vw] p-1 flex items-center justify-center hover:bg-yellow-500 transition-colors"
  //           >
  //             قراءة المزيد
  //           </Link>
  //         </div>
  //       </div>
  //     );
  //   });

  //   return (
  //     <div
  //       className="flex flex-col items-center overflow-hidden   gap-4  w-screen bg-[#FDB800]"
  //       style={{ direction: "rtl" }}
  //     >
  //       <div className="px-[6%] lg:px-0 mt-4 w-full md:w-[70%]  flex flex-row justify-between items-center gap-4">
  //         <h1 className="text-[4vw] md:text-[3vw] lg:text-[1.4vw] font-bold text-center md:text-right text-gray-900">
  //           {showAll ? "كل المعروضات" : "أحدث المعروضــات ✨"}
  //         </h1>

  //         {/* Dropdown فلتر الـ brands */}
  //         <div className="relative w-[35%] md:w-[20%]">
  //           {/* Dropdown Button */}
  //           <div className="relative ">
  //             <button
  //               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  //               className="bg-white border w-full border-gray-300    rounded-[14px] p-1 text-[3vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2  justify-between"
  //             >
  //               <span className="text-[2.5vw] md:text-[1.5vw] lg:text-[1vw] p-1">
  //                 {getSelectedBrandDisplayName()}
  //               </span>
  //               <svg
  //                 className={`w-3 h-3 transition-transform ${
  //                   isDropdownOpen ? "rotate-180" : ""
  //                 }`}
  //                 fill="none"
  //                 stroke="currentColor"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth={2}
  //                   d="M19 9l-7 7-7-7"
  //                 />
  //               </svg>
  //             </button>

  //             {isDropdownOpen && (
  //               <div className=" absolute top-full  mt-1 w-full bg-white border  border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
  //                 {filteredCars.length !== availableCars.length && (
  //                   <button
  //                     aria-label="all cars button"
  //                     onClick={() => handleBrandSelect("all")}
  //                     className={`w-full text-right font-semibold p-2  text-[2.5vw] md:text-[1.2vw] lg:text-[1vw] hover:bg-gray-100 transition-colors ${
  //                       selectedBrand === "all"
  //                         ? "bg-gray-100 text-gray-800"
  //                         : "text-gray-700"
  //                     }`}
  //                   >
  //                     كل السيارات
  //                   </button>
  //                 )}

  //                 {uniqueBrands.map((brand) => (
  //                   <button
  //                     key={brand}
  //                     onClick={() => handleBrandSelect(brand)}
  //                     className={`w-full font-semibold  text-right px-4 py-2 text-[2.5vw] md:text-[1.2vw] lg:text-[1vw] hover:bg-gray-100 transition-colors ${
  //                       selectedBrand === brand
  //                         ? "bg-gray-100 text-gray-800"
  //                         : "text-gray-700"
  //                     }`}
  //                   >
  //                     {brand}
  //                   </button>
  //                 ))}
  //               </div>
  //             )}
  //           </div>

  //           {/* إغلاق الدروب داون عند النقر خارجها */}
  //           {isDropdownOpen && (
  //             <div
  //               className="fixed inset-0 z-0"
  //               onClick={() => setIsDropdownOpen(false)}
  //             />
  //           )}
  //         </div>
  //       </div>

  //       <div className="w-full relative flex items-center justify-center">
  //         {filteredCars.length > 0 ? (
  //           <EmblaCarousel slides={aboutSlides} options={OPTIONS} />
  //         ) : (
  //           <div className="text-center py-8">
  //             <p className="text-gray-500">لا توجد سيارات لعرضها</p>
  //             {selectedBrand !== "all" && (
  //               <button
  //                 aria-label="all cars button"
  //                 onClick={() => setSelectedBrand("all")}
  //                 className="mt-2 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
  //               >
  //                 عرض كل المعروضات
  //               </button>
  //             )}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // export default HomeCars;

  "use client";
import React, { useEffect, useState, useCallback } from "react";
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

  // دالة لتحميل السيارات من API
  const fetchCars = useCallback(
    async (pageNum: number = 1, loadMore: boolean = false) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/cars?page=${pageNum}&limit=10`);
        const data = await response.json();

        if (loadMore) {
          // عند التحميل الإضافي
          setCars((prev) => [...prev, ...data.data]);
          setDisplayedCars((prev) => [...prev, ...data.data]);
        } else {
          // عند التحميل الأول أو تغيير الفلتر
          setCars(data.data);
          setDisplayedCars(data.data);
        }

        setTotalCars(data.pagination.total);
        setHasMore(data.pagination.page < data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  // التحميل الأول
  useEffect(() => {
    fetchCars(1, false);
  }, []);

  // دالة لتحميل المزيد من السيارات
  const handleLoadMore = async () => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      await fetchCars(nextPage, true);
    }
  };

  // فلترة السيارات حسب الـ Brand
  const filteredCars =
    selectedBrand === "all"
      ? displayedCars
      : displayedCars.filter((car) => car.brand === selectedBrand);

  // الحصول على الـ Brands الفريدة
  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand))).filter(
    Boolean,
  );

  // إنشاء السلايدات للـ Carousel (سيارات + زر عرض المزيد)
  const aboutSlides = [
    // أولاً: سلايدات السيارات
    ...filteredCars.map((car) => {
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
          className="p-[14px] bg-white rounded-[26px] overflow-hidden shadow-lg flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-300 w-full h-full"
        >
          {/* سلايدر صور السيارة */}
          <EmblaCarouselSlider slides={carSlides} options={{ loop: true }} />

          {/* تفاصيل السيارة */}
          <div className="flex flex-col gap-2 mt-[3vh] w-full flex-grow">
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
              className="text-black text-justify text-[3vw] md:text-[1.5vw] lg:text-[1.5vw] xl:text-[1vw] font-bold line-clamp-4 flex-grow"
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
    }),

    // ثانياً: زر عرض المزيد (يظهر كسلايد آخر فقط إذا كان هناك المزيد لتحميله)
    ...(hasMore
      ? [
          <div
            key="load-more-button"
            className="p-[14px] flex flex-col items-center justify-center w-full h-full"
          >
            <div className="bg-white rounded-[26px] overflow-hidden shadow-lg flex flex-col items-center justify-center p-8 w-full h-full">
              <div className="flex flex-col items-center justify-center gap-6 h-full">
                <svg
                  onClick={handleLoadMore}
                  className="w-[20vw] h-[20vw] md:w-[10vw] md:h-[10vw] lg:w-[6vw] lg:h-[6vw] text-[#FDB800]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-[#FDB800] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[4vw] md:text-[2vw] lg:text-[1.2vw] min-h-[48px] flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      جاري التحميل...
                    </span>
                  ) : (
                    "عرض المزيد"
                  )}
                </button>
              </div>
            </div>
          </div>,
        ]
      : []),

    // ثالثاً: رسالة اكتمال العرض (إذا انتهت السيارات)
    ...(!hasMore && filteredCars.length > 0
      ? [
          <div
            key="completed-message"
            className="p-[14px] flex flex-col items-center justify-center w-full h-full"
          >
            <div className="bg-white rounded-[26px] overflow-hidden shadow-lg flex flex-col items-center justify-center p-8 w-full h-full">
              <div className="flex flex-col items-center justify-center gap-6 h-full">
                <div className="w-[20vw] h-[20vw] md:w-[10vw] md:h-[10vw] lg:w-[6vw] lg:h-[6vw] bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-1/2 h-1/2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>,
        ]
      : []),
  ];

  const OPTIONS = {
    loop: false,
    duration: 20,
    align: "start" as const,
  };

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
  };

  const getSelectedBrandDisplayName = () => {
    if (selectedBrand === "all") return "كل السيارات";
    return selectedBrand;
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
          <div className="w-full">
            <EmblaCarousel slides={aboutSlides} options={OPTIONS} />
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">جاري تحميل السيارات...</p>
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
