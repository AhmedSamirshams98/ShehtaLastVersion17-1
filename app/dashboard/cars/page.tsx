"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Car, User } from "@/types/car";
import { useCarStore } from "@/stores/carStore";
import HomeCars from "@/app/components/HomeComponents/HomeCars";

interface CarFormData extends Omit<Car, "id" | "images"> {
  imageFiles: File[];
  existingImages?: string[]; // For editing - keep existing images
}

export default function CarDashboard() {
  const { fetchCars } = useCarStore();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state

  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    condition: "جديدة",
    description: "",
    kilometers: 0,
    status: "available",
    imageFiles: [],
    existingImages: [],
  });

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Function to handle car edit
  const handleEditCar = (car: Car) => {
    setIsEditing(true);
    setEditingCarId(car.id ?? null);

    // Fill the form with car data
    setFormData({
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || new Date().getFullYear(),
      condition: car.condition || "جديدة",
      description: car.description || "",
      kilometers: car.kilometers || 0,
      status: car.status || "available",
      imageFiles: [], // Start with empty for new files
      existingImages: car.images || [], // Keep existing images
    });

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من وجود بيانات مطلوبة
    if (!formData.brand || !formData.model) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // التحقق من وجود صور (إما صور موجودة أو جديدة)
    if (
      formData.existingImages?.length === 0 &&
      formData.imageFiles.length === 0
    ) {
      alert("يرجى إضافة صورة واحدة على الأقل للسيارة");
      return;
    }
    setIsSubmitting(true); // Start loading

    const form = new FormData();
    form.append("brand", formData.brand);
    form.append("model", formData.model);
    form.append("year", formData.year.toString());
    form.append("condition", formData.condition);
    form.append("description", formData.description);
    form.append("kilometers", formData.kilometers.toString());
    form.append("status", formData.status);

    // إضافة الملفات الجديدة
    formData.imageFiles.forEach((file) => {
      form.append("images", file);
    });

    try {
      if (isEditing && editingCarId) {
        // Update existing car
        console.log("جاري تحديث البيانات...", {
          id: editingCarId,
          brand: formData.brand,
          model: formData.model,
        });

        // For update, we need to send all images (existing + new)
        const allImages = [
          ...(formData.existingImages || []),
          ...formData.imageFiles.map((file) => URL.createObjectURL(file)),
        ];

        const updateData = {
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          condition: formData.condition,
          description: formData.description,
          kilometers: formData.kilometers,
          status: formData.status,
          images: allImages, // Send all images for update
        };

        const response = await axios.put(
          `/api/cars/${editingCarId}`,
          updateData,
        );

        console.log("تم تحديث السيارة بنجاح:", response.data);
        alert("تم تحديث السيارة بنجاح!");
      } else {
        // Add new car
        console.log("جاري إرسال البيانات...", {
          brand: formData.brand,
          model: formData.model,
          imageCount: formData.imageFiles.length,
        });

        const response = await axios.post("/api/cars", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("تم إضافة السيارة بنجاح:", response.data);
        alert("تم إضافة السيارة بنجاح!");
      }

      // إعادة تعيين النموذج
      resetForm();

      // إعادة تحميل السيارات
      fetchCars();
    } catch (error) {
      console.error("Error saving car:", error);
      alert("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false); // Stop loading regardless of success/error
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      condition: "جديدة",
      description: "",
      kilometers: 0,
      status: "available",
      imageFiles: [],
      existingImages: [],
    });
    setIsEditing(false);
    setEditingCarId(null);
  };

  // Cancel edit function
  const handleCancelEdit = () => {
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...newFiles],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "kilometers" ? parseInt(value) || 0 : value,
    }));
  };

  const removeImage = (index: number, type: "existing" | "new") => {
    if (type === "existing") {
      setFormData((prev) => ({
        ...prev,
        existingImages:
          prev.existingImages?.filter((_, i) => i !== index) || [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      }));
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session error", err);
        setUser(null);
      }
    };

    fetchSession();
  }, []);

  const loginWithGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">
            تسجيل الدخول مطلوب
          </h1>
          <p className="mb-6 text-gray-600 text-center">
            يجب تسجيل الدخول كمسؤول للوصول إلى لوحة التحكم
          </p>
          <button
            className="bg-[#fdba00] cursor-pointer w-full p-2 rounded-[26px] text-white"
            onClick={loginWithGoogle}
          >
            تسجيل الدخول باستخدام Google
          </button>
        </div>
      </div>
    );
  }

  const carBrands = [
    "Toyota",
    "Jeep",
    "Nissan",
    "Hyundai",
    "Kia",
    "Mitsubishi",
    "Honda",
    "Chevrolet",
    "Renault",
    "Peugeot",
    "Skoda",
    "BMW",
    "MercedesBenz",
    "Audi",
    "Volkswagen",
    "Fiat",
    "SEAT",

    "Chery",
    "BYD",
    "Geely",
    "MG",
  ];
  if (user.role !== "admin" && user.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
            غير مصرح بالوصول
          </h1>
          <p className="mb-6 text-gray-600 text-center">
            أنت لا تملك صلاحيات المسؤول للوصول إلى لوحة التحكم
          </p>
          <button
            className="bg-gray-500 cursor-pointer w-full p-2 rounded-[26px] text-white"
            onClick={() => (window.location.href = "/")}
          >
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" overflow-hidden min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 flex flex-col items-center  border rounded px-[8%]"
      >
        <h2 className="text-xl mb-4 text-center font-semibold">
          {isEditing ? "تعديل سيارة" : "إضافة سيارة جديدة"}
        </h2>

        {isEditing && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg w-full">
            <p>جاري تعديل السيارة - يمكنك تغيير الحقول التي تريد تعديلها فقط</p>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="mt-2 bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              إلغاء التعديل
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
          <label className="w-full flex flex-col gap-2 ">
            اختر ماركة السيارة
            <select
              name="brand"
              value={formData.brand}
              disabled={isSubmitting}
              onChange={handleInputChange}
              className="p-2 border-1 font-medium text-[#626262] border-[#0000000] rounded "
              required
            >
              <option value="">اختر الماركة</option>
              {carBrands.map((brand) => (
                <option className="" key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 ">
            موديل السيارة
            <input
              disabled={isSubmitting}
              type="text"
              name="model"
              placeholder=" ادخل موديل السيارة"
              value={formData.model}
              onChange={handleInputChange}
              className="p-2 border font-medium  text-[#626262] rounded"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            سنة السيارة
            <select
              disabled={isSubmitting}
              name="year"
              value={formData.year}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  year: parseInt(e.target.value),
                }))
              }
              className="p-2 border font-medium text-[#626262] rounded"
            >
              <option value={0}>اختر السنة</option>
              {Array.from({ length: 50 }, (_, i) => {
                const year = new Date().getFullYear() - i; // السنوات من الحالي للوراء
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="flex flex-col gap-2 ">
            ادخل عدد كيلومترات السيارة
            <input
              disabled={isSubmitting}
              type="number"
              name="kilometers"
              placeholder="أدخل عدد الكيلومترات (0 للسيارات الجديدة)"
              value={
                formData.kilometers === 0 ? "" : formData.kilometers.toString()
              }
              onChange={(e) => {
                const value = e.target.value;
                // Allow any positive number including 0
                const numValue = value === "" ? 0 : parseInt(value) || 0;
                setFormData((prev) => ({
                  ...prev,
                  kilometers: numValue,
                }));
              }}
              onFocus={(e) => {
                // Select all text when focused for easy editing
                e.target.select();
              }}
              className="p-2 border font-medium text-[#626262] rounded"
              min="0" // Allow 0 and positive numbers
              step="1"
            />
          </label>

          <label className="flex flex-col gap-2 ">
            اختر حالة السيارة
            <select
              disabled={isSubmitting}
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="p-2 border font-medium text-[#626262] rounded"
            >
              <option value="جديدة">جديدة</option>
              <option value="مستعملة">مستعملة</option>
            </select>
          </label>

          <label className="flex items-center gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.status === "available"}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.checked ? "available" : "unavailable",
                }))
              }
              className="w-5 h-5 accent-green-500"
            />
            <span className="font-medium text-[#626262]">السيارة متاحة</span>
          </label>
        </div>

        <label className="flex flex-col w-full gap-2  mt-2 ">
          ادخل وصف السيارة
          <textarea
            disabled={isSubmitting}
            name="description"
            placeholder="الوصف"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border font-medium text-[#626262] rounded "
            rows={3}
          />
        </label>

        {/* عرض الصور الموجودة (في حالة التعديل) */}
        {isEditing &&
          formData.existingImages &&
          formData.existingImages.length > 0 && (
            <div className="mt-4 w-full">
              <h3 className="text-lg mb-2">
                الصور الحالية ({formData.existingImages.length}):
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={imageUrl}
                      alt={`Existing ${index}`}
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => removeImage(index, "existing")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* عرض الملفات الجديدة المختارة */}
        {formData.imageFiles.length > 0 && (
          <div className="mt-4 w-full">
            <h3 className="text-lg mb-2">
              الصور الجديدة المختارة ({formData.imageFiles.length}):
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => removeImage(index, "new")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                  <p className="text-xs mt-1 truncate w-24">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 w-full">
          <label className="block text-sm font-medium mb-2">
            {isEditing
              ? "إضافة صور جديدة (اختياري)"
              : "صور السيارة * (اختر صورة واحدة على الأقل)"}
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-4 border rounded"
          />
        </div>

        <div className="flex gap-4 mt-4 w-full md:w-[40%]">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-4 py-2 rounded flex items-center justify-center ${
              isEditing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "جاري التحديث..." : "جاري الإضافة..."}
              </>
            ) : isEditing ? (
              "تحديث السيارة"
            ) : (
              "إضافة سيارة"
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* عرض السيارات */}
      <HomeCars isDashboard={true} onEditCar={handleEditCar} />
    </div>
  );
}
