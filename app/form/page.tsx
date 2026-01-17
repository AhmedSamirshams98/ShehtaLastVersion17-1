"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";

interface OrderForm {
  customer_name: string;
  phone_number: string;
  car_brand: string;
  car_model: string;
  car_description: string;
}

const Page = () => {
  const [formData, setFormData] = useState<OrderForm>({
    customer_name: "",
    phone_number: "",
    car_brand: "",
    car_model: "",
    car_description: "",
  });

  const [message, setMessage] = useState("");
  const [buttonSuccess, setButtonSuccess] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.");
        setButtonSuccess(true); // ✅ Change button color
        setTimeout(() => setButtonSuccess(false), 5000); // Reset after 5s
        // إعادة تعيين النموذج
        setFormData({
          customer_name: "",
          phone_number: "",
          car_brand: "",
          car_model: "",
          car_description: "",
        });
      } else {
        setMessage(`❌ ${result.error || "حدث خطأ أثناء الإرسال"}`);
      }
    } catch (error) {
      setMessage("❌ حدث خطأ في الشبكة. حاول مرة أخرى.");
      console.error(error);
    } finally {
    }
  };
  return (
    <div
      className="relative min-h-[100vh] mt-[2%] px-[8%] flex flex-col items-center gap-4  "
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col text-center md:text-right">
        <h1 className=" text-[6vw] md:text-[2.5vw]">نموذج طلب سيارة ✨</h1>
        <h1 className="font-medium w-full text-[4vw] md:text-[1.6vw]">
          ادخل بيانات التواصل معك و تفاصيل طلبك و سيتم التواصل معك بكل التفاصيل
          اللى محتاج تعرفها زى السعر و المواصفات الكاملة و الموعد المتوقع
          للاستلام
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:grid grid-cols-1 md:grid-cols-2  w-full gap-4"
      >
        <div className="flex flex-col items-start w-full gap-2">
          <label>الاســــــــم :</label>
          <input
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            required
            className="font-medium border-[1px] w-full border-[#000000] p-4 placeholder:font-medium rounded-[8px]"
            placeholder="ادخل الاسم بالكامل هنا.."
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <label> رقم الهاتف (اتصال & واتساب ) :</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
            type="tel"
            className="font-medium border-[1px] w-full border-[#000000] p-4 placeholder:font-medium placeholder:text-right rounded-[8px]"
            placeholder="01234567890"
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <label> ماركة السيارة :</label>
          <input
            name="car_brand"
            value={formData.car_brand}
            onChange={handleInputChange}
            required
            className="font-medium border-[1px] w-full border-[#000000] p-4 placeholder:font-medium rounded-[8px]"
            placeholder="مثال : مرسيدس"
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <label> موديل السيارة :</label>
          <input
            name="car_model"
            value={formData.car_model}
            onChange={handleInputChange}
            required
            className="font-medium border-[1px] w-full border-[#000000] p-4 placeholder:font-medium rounded-[8px]"
            placeholder="مثال : GLC أو جى ال سى"
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2 col-span-2">
          <label> وصف الطلب :</label>
          <textarea
            name="car_description"
            value={formData.car_description}
            onChange={handleInputChange}
            className="border-[1px] w-full border-[#000000] font-medium p-8 placeholder:font-medium rounded-[8px] min-h-[120px]"
            placeholder="اكتب سنة التصنيع , اللون , الفئة و كل المواصفات الأخرى.."
          />
        </div>
        <div className="col-span-2 w-full flex items-center justify-center">
          <Button
            type="submit"
            kind="secondary"
            className={`transition-all duration-500 ${
              buttonSuccess
                ? "bg-green-600 text-white  hover:bg-green-700"
                : " text-black bg-transparent hover:bg-yellow-500"
            }`}
          >
            {buttonSuccess ? "✅ تم الإرسال!" : "اطلب سيارتك الآن!"}
          </Button>
        </div>
      </form>
      {message && (
        <div
          className={`col-span-2 p-4 rounded-lg text-center ${
            message.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Page;
