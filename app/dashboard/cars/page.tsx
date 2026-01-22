"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import UniLoading from "@/app/components/shared/UniLoading";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

interface CarImage {
  id: number;
  image_url: string;
  car_id: number;
}

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: string;
  kilometers?: number;
  description?: string;
  price: number;
  status: string;
  car_images: CarImage[];
}

interface CarFormData {
  brand: string;
  model: string;
  year: number;
  condition: string;
  kilometers?: number;
  description?: string;
  status: string;
  price: number;
  imageFiles: File[];
  existingImages: string[];
}

export default function DashboardCarsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [price, setPrice] = useState("");

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const [isAdding, setIsAdding] = useState(false); // للـ Add Modal
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    condition: "جديدة",
    description: "",
    kilometers: 0,
    price: 0,
    status: "available",
    imageFiles: [],
    existingImages: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const carBrands = [
    "Porcshe",
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

  // ------------------ Fetch Session ------------------
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return router.replace("/login");
      const data = await res.json();
      if (!data.user) return router.replace("/login");
      setCurrentUser(data.user);
    } catch {
      router.replace("/login");
    }
  };

  // ------------------ Fetch Cars ------------------
  const fetchAllCars = async () => {
    try {
      const res = await fetch("/api/cars");
      const data = await res.json();
      setCars(data.cars || data); // تأكد من البنية
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await fetchSession();
        await fetchAllCars();
        console.log("Session:", currentUser);
        console.log("Cars:", cars);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) return <UniLoading />;

  function statusInArabic(status: string) {
    if (status === "available") return "متاحة";
    if (status === "unavailable") return "غير متاحة";
    return "-";
  }

  function priceForDisplay(price: number | undefined) {
    if (price === undefined || price === null) return "-";
    return price.toLocaleString("en-US"); // يفصل بالألف
  }
  // ------------------ Handlers ------------------
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "kilometers" || name === "price"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...Array.from(files)],
    }));
  };

  const removeImage = (index: number, type: "existing" | "new") => {
    if (type === "existing") {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      }));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCar(null);
    setIsAdding(false);
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      condition: "جديدة",
      description: "",
      kilometers: 0,
      price: 0,
      status: "available",
      imageFiles: [],
      existingImages: [],
    });
  };

  // ------------------ Submit Edit ------------------
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    if (!formData.brand || !formData.model) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

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
      price: price ? Number(price.replace(/,/g, "")) : 0,
      status: formData.status,
      images: allImages,
    };

    try {
      await axios.put(`/api/cars/${editingCar.id}`, updateData);
      alert("تم تحديث السيارة بنجاح!");
      handleCancel();
      fetchAllCars();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحديث السيارة");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------ Add ------------------
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand || !formData.model)
      return alert("يرجى ملء جميع الحقول");

    if (formData.imageFiles.length === 0)
      return alert("يرجى إضافة صورة واحدة على الأقل");

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("brand", formData.brand);
      data.append("model", formData.model);
      data.append("year", formData.year.toString());
      data.append("condition", formData.condition);
      data.append("description", formData.description || "");
      data.append("kilometers", (formData.kilometers || 0).toString());
      data.append("price", price ? price.replace(/,/g, "") : "0");
      data.append("status", formData.status);

      formData.imageFiles.forEach((file) => {
        data.append("images", file);
      });

      await axios.post("/api/cars", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("تم إضافة السيارة بنجاح!");
      handleCancel();
      fetchAllCars();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة السيارة");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------ Edit ------------------
  const handleEditCar = (car: Car) => {
    setIsEditing(true);
    setEditingCar(car);
    setFormData({
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || new Date().getFullYear(),
      condition: car.condition || "جديدة",
      description: car.description || "",
      kilometers: car.kilometers || 0,
      price: car.price || 0,
      status: car.status || "available",
      imageFiles: [],
      existingImages: car.car_images.map((img) => img.image_url) || [],
    });
    setPrice(car.price?.toLocaleString("en-US") || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ------------------ Delete ------------------
  const handleDeleteCar = async (carId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه السيارة؟")) return;
    try {
      await axios.delete(`/api/cars/${carId}`);
      setCars((prev) => prev.filter((c) => c.id !== carId));
      alert("تم حذف السيارة بنجاح");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حذف السيارة");
    }
  };

  return (
    <section className="space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">كل السيارات</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          أضف سيارة جديدة
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-md border">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-right">صورة</th>
              <th className="px-4 py-2 text-right">الماركة</th>
              <th className="px-4 py-2 text-right">الموديل</th>
              <th className="px-4 py-2 text-right">السنة</th>
              <th className="px-4 py-2 text-right">الكيلومترات</th>
              <th className="px-4 py-2 text-right">السعر</th>
              <th className="px-4 py-2 text-right">الحالة</th>
              <th className="px-4 py-2 text-right">التوفر</th>
              <th className="px-4 py-2 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {cars?.map((car) => (
              <tr key={car.id} className="border-t">
                <td className="px-4 py-2 w-[120px] h-[80px]">
                  {car.car_images.length > 0 ? (
                    <Image
                      src={car.car_images[0].image_url}
                      alt={car.model}
                      width={120}
                      height={80}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-28 h-20 bg-gray-200 flex items-center justify-center rounded">
                      لا توجد صورة
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{car.brand}</td>
                <td className="px-4 py-2">{car.model}</td>
                <td className="px-4 py-2">{car.year}</td>
                <td className="px-4 py-2">{car.kilometers ?? "-"}</td>
                <td className="px-4 py-2">{priceForDisplay(car.price)}</td>
                <td className="px-4 py-2">{car.condition}</td>
                <td className="px-4 py-2">{statusInArabic(car.status)}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditCar(car)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Add / Edit Modal ---------------- */}
      {(isEditing || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full overflow-y-auto max-w-3xl max-h-[90vh]  p-6 relative">
            <button
              onClick={handleCancel}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700"
            >
              <XCircle size={28} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "تعديل السيارة" : "إضافة سيارة جديدة"}
            </h2>

            <form
              onSubmit={isEditing ? handleEditSubmit : handleAddSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                <label className="flex flex-col gap-2">
                  الماركة
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                    className="p-2 border rounded"
                  >
                    <option value="">اختر الماركة</option>
                    {carBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  الموديل
                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="p-2 border rounded"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  السنة
                  <input
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="p-2 border rounded"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  الكيلومترات
                  <input
                    name="kilometers"
                    type="number"
                    value={formData.kilometers}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="p-2 border rounded"
                  />
                </label>
                {formData.status === "available" && (
                  <label className="flex flex-col gap-2">
                    السعر
                    <input
                      type="text"
                      name="price"
                      value={price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const formatted = value.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ",",
                        );
                        setPrice(formatted);
                      }}
                      placeholder="سعر السيارة"
                      inputMode="numeric"
                      className="p-2 border rounded"
                    />
                  </label>
                )}
                <label className="flex flex-col gap-2">
                  الحالة
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="p-2 border rounded"
                  >
                    <option value="جديدة">جديدة</option>
                    <option value="مستعملة">مستعملة</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === "available"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.checked ? "available" : "unavailable",
                      }))
                    }
                    disabled={isSubmitting}
                    className="w-5 h-5 accent-green-500"
                  />
                  <span>السيارة متاحة</span>
                </label>
              </div>

              <label className="flex flex-col gap-2 w-full mt-2">
                وصف السيارة
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={5}
                  className="min-h-[120px] max-h-[300px] overflow-y-auto p-2 border rounded"
                />
              </label>

              {/* الصور */}
              {(formData.existingImages.length > 0 ||
                formData.imageFiles.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* صور موجودة سابقًا */}
                  {formData.existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="relative">
                      <Image
                        src={url}
                        alt={`existing-${i}`}
                        width={100}
                        height={100}
                        className="object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i, "existing")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex justify-center items-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* الصور الجديدة */}
                  {formData.imageFiles.map((file, i) => (
                    <div key={`new-${i}`} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={100}
                        height={100}
                        className="object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i, "new")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex justify-center items-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 border-2 border-black p-2 ">
                <label
                  htmlFor="car-images"
                  className="flex flex-col items-center justify-center w-full h-40
             border-2 border-dashed rounded-xl cursor-pointer
             text-gray-500 hover:border-gray-400 hover:text-gray-700
             transition"
                >
                  <span className="text-sm">ضع صور السيارة</span>
                  <span className="text-xs mt-1">
                    (يمكنك اختيار أكثر من صورة)
                  </span>

                  <input
                    id="car-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "جاري المعالجة..."
                    : isEditing
                      ? "تحديث السيارة"
                      : "إضافة السيارة"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
