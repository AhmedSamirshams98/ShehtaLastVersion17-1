"use client";
import React from "react";
import shehta1 from "../../../public/images/shehta1.png";
import shehta2 from "../../../public/images/shehta2.png";
import shehta3 from "../../../public/images/shehta3.png";
import shehta4 from "../../../public/images/shehta4.png";
import shehta5 from "../../../public/images/shehta5.png";
import shehta6 from "../../../public/images/shehta6.png";
import shehta7 from "../../../public/images/shehta7.png";
import shehta8 from "../../../public/images/shehta8.png";
import shehta9 from "../../../public/images/shehta9.png";
import Image from "next/image";
import "../emblaSlider/emblaSlider.css";
import EmblaSlider from "../emblaSlider/EmblaSlider";

const HomeAbout = () => {
  const OPTIONS = {
    loop: true,
    duration: 20,
  };

  const aboutSlides = [
    <div key={1} className="slider-slide ">
      <Image
        src={shehta1}
        alt="About Shehta Trading"
        className="w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={2} className="slider-slide ">
      <Image
        src={shehta2}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={3} className="slider-slide ">
      <Image
        src={shehta3}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={4} className="slider-slide ">
      <Image
        src={shehta4}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={5} className="slider-slide ">
      <Image
        src={shehta5}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={6} className="slider-slide ">
      <Image
        src={shehta6}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={7} className="slider-slide ">
      <Image
        src={shehta7}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={8} className="slider-slide ">
      <Image
        src={shehta8}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
    <div key={9} className="slider-slide ">
      <Image
        src={shehta9}
        alt="About Shehta Trading"
        className="object-cover w-full h-full rounded-[26px]"
      />
    </div>,
  ];

  return (
    <div
      id="about"
      className="  rounded-[42px]   bg-[#FFFFFF] p-[6%] md:p-[2%] flex flex-col md:flex-row gap-[2vw] "
      style={{ direction: "rtl" }}
    >
      <div className="w-full flex flex-col gap-2">
        <h1 className="  font-bold  text-[4vw]  md:text-[2vw] text-center md:text-right">
          لمحة عن شحتة للتجارة ✨
        </h1>
        <p className="font-medium text-justify text-[3vw] md:text-[1.4vw] leading-relaxed md:leading-[2.2vw]  ">
          بدأت رحلة شحتة فى عام 1970 فى تجارة الأدوات المكتبية و الكتب و
          مستلزمات الدراسة و الخردوات و التحف و الأنتيكات , من مدينة بلطيم مدينة
          السحر و الجمال كما يطلق عليها لطبيعتها الخلابة و أجوائها الساحلية
          المميزة <br /> استمرت الرحلة و الطموح حتى العام ١٩٩٨ عندما قرر الأبناء
          الدخول الى عالم السيارات من معقل التجارة و البيع و الشراء و هو سوق
          السيارات بالقاهرة و الذى يقام كل يوم جمعة ، و على مسافة تبعد 200 كيلو
          متر من موطن شحتة للتجارة يولد حلم جديد و طموح جديد بالتميز و الريادة
          فى عالم السيارات
          <br /> مرت الرحلة بمحطات كثيرة من التعثر و الازدهار حتى أصبح اسم شحتة
          للتجارة محل الثقة و التقدير لعملائه فى مختلف محافظات مصر , خصوصاً مع
          انتشار مواقع التواصل الاجتماعى و توسع سوق السيارات بمصر فى الفترة بين
          العام 2008 و حتى 2021 ، كان لزاماً و التزاماً ان تتحقق الريادة فى
          التوسع و تحقيق متطلبات العملاء و السعى نحو توفير أفضل خدمة و اضمن منتج
          , فكان الهدف فى هذه الفترة نحو استيراد السيارات الجديدة و المستعملة من
          مختلف الأسواق حول العالم و تتحق الريادة مرة أخرى بفضل الله ثم ثقة
          عملائنا , مما يزيد إيماننا بكرم الله و فضله و يضع على عاتقنا مسؤولية
          الالتزام و التجديد المستمر لخدماتنا و الوصول لرضاء عملائنا التام شركاء
          الرحلة و داعميها..
        </p>
      </div>
      <div className=" w-full md:w-[40%] ">
        <EmblaSlider slides={aboutSlides} options={OPTIONS} />
      </div>
    </div>
  );
};

export default HomeAbout;
