import Image from "next/image";
import React from "react";
import order from "../../../public/images/order.svg";
import Link from "next/link";
import { Button } from "../ui/Button";

const HomeHowtoOrder = () => {
  return (
    <div className="flex  flex-col items-center  justify-center gap-6 mb-[4%] w-full">
      <h1 className="text-[4vw] md:text-[2.5vw]">
        كيف يمكنك طلب سيارتك المخصصة؟
      </h1>
      <Image src={order} alt="كيف تطلب سيارتك من شحتة للتجاره" />
      <Link href="/form">
        <Button kind="secondary">! اطلب سيارتك الآن</Button>
      </Link>{" "}
    </div>
  );
};

export default HomeHowtoOrder;
