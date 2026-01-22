"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CarIcon,
  CheckCircleIcon,
  ClipboardList,
  UsersIcon,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { PageHeader } from "../components/shared/PageHeader";
import UniLoading from "../components/shared/UniLoading";
import Image from "next/image";
import axios from "axios";
import { useCarStore } from "@/stores/carStore";
import { Car, CarFormData, User } from "@/types/car";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [price, setPrice] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    condition: "جديدة",
    description: "",
    price: 0,

    kilometers: 0,
    status: "available",
    imageFiles: [],
    existingImages: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  function statusInArabic(status: string) {
    if (status === "available") return "متاحة";
    if (status === "unavailable") return "غير متاحة";
    return "-";
  }

  function priceForDisplay(price: number | undefined) {
    if (price === undefined || price === null) return "-";
    return price.toLocaleString("en-US"); // يفصل بالألف
  }

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

  const { availableCars, fetchAvailableCars, stats, fetchStats, loading } =
    useCarStore();

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchSession();
      await fetchStats();
      await fetchAvailableCars();
    };

    fetchAllData();
  }, []);

  if (loading) return <UniLoading />;
  if (!stats) return null;
  const {
    totalCars,
    availableCars: availableCarsCount,
    totalOrders,
    totalUsers,
  } = stats;

  // ---- Editing Handlers ----
  const handleEditCarFromTable = (car: Car) => {
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
      existingImages: car.car_images?.map((img) => img.image_url) || [],
    });
    setPrice(car.price?.toLocaleString("en-US") || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
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
        name === "year" || name === "kilometers" || name === "price"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCar(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    if (!formData.brand || !formData.model) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (
      (!formData.existingImages || formData.existingImages.length === 0) &&
      formData.imageFiles.length === 0
    ) {
      alert("يرجى إضافة صورة واحدة على الأقل");
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
      price: formData.price,

      status: formData.status,
      images: allImages,
    };

    try {
      await axios.put(`/api/cars/${editingCar.id}`, updateData);
      alert("تم تحديث السيارة بنجاح!");
      handleCancelEdit();
      fetchAvailableCars();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحديث السيارة");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <section className="space-y-6 relative">
      <PageHeader
        title="لوحة التحكم"
        description={`مرحباً بك ${currentUser?.name || ""}`}
      />

      {/* ===== Dashboard Stats ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="">
          <CardHeader>
            <CardTitle>إجمالي السيارات</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <CarIcon className="text-blue-500" />
            <span className="text-lg font-bold">{totalCars}</span>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>السيارات المتاحة</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <CheckCircleIcon className="text-green-500" />
            <span className="text-lg font-bold">{availableCarsCount}</span>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <ClipboardList className="text-yellow-500" />
            <span className="text-lg font-bold">{totalOrders}</span>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>إجمالي المستخدمين</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <UsersIcon className="text-purple-500" />
            <span className="text-lg font-bold">{totalUsers}</span>
          </CardContent>
        </Card>
      </div>

      {/* ===== Available Cars Table ===== */}
      <h1 className="text-2xl font-bold mb-4">السيارات المتاحة</h1>
      <div className="overflow-x-auto bg-white">
        <table className="min-w-full table-auto border border-gray-200 rounded-md">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2 text-right">صورة</th>
              <th className="px-4 py-2 text-right">الماركة</th>
              <th className="px-4 py-2 text-right">الموديل</th>
              <th className="px-4 py-2 text-right">السنة</th>
              <th className="px-4 py-2 text-right">الكيلومترات</th>
              <th className="px-4 py-2 text-right">السعر</th>
              <th className="px-4 py-2 text-right">الحالة</th>
              <th className="px-4 py-2 text-right">التوفر</th>
              <th className="px-4 py-2 text-right">الوصف</th>
              <th className="px-4 py-2 text-right">تعديل</th>
              <th className="px-4 py-2 text-right">حذف</th>
            </tr>
          </thead>
          <tbody>
            {availableCars?.map((car) => (
              <tr key={car.id} className="border-t">
                <td className="px-4 py-2 w-[120px] h-[80px]">
                  {car.car_images?.length ? (
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
                <td className="px-4 py-2">{getBrandArabicName(car.brand)}</td>
                <td className="px-4 py-2">{car.model}</td>
                <td className="px-4 py-2">{car.year}</td>
                <td className="px-4 py-2">{priceForDisplay(car.price)}</td>
                <td className="px-4 py-2">{car.condition}</td>
                <td className="px-4 py-2">{statusInArabic(car.status)}</td>
                <td className="px-4 py-2">{car.status}</td>
                <td className="px-4 py-2">{car.description ?? "-"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditCarFromTable(car)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    تعديل
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={async () => {
                      if (!confirm("هل أنت متأكد من حذف هذه السيارة؟")) return;
                      try {
                        await useCarStore.getState().deleteCar(car.id);
                        alert("تم حذف السيارة بنجاح");
                      } catch (err) {
                        console.error(err);
                        alert("حدث خطأ أثناء حذف السيارة");
                      }
                    }}
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

      {isEditing && editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full overflow-y-auto max-w-3xl max-h-[90vh] p-6 relative">
            {/* زر إغلاق */}
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700"
            >
              <XCircle size={28} />
            </button>

            <h2 className="text-xl font-bold mb-4">تعديل السيارة</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Grid Inputs */}
              <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  اختر ماركة السيارة
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">اختر الماركة</option>
                    {carBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  موديل السيارة
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="موديل السيارة"
                    className="p-2 border rounded"
                    required
                    disabled={isSubmitting}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  سنة السيارة
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    disabled={isSubmitting}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  الكيلومترات
                  <input
                    type="number"
                    name="kilometers"
                    value={formData.kilometers}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    min={0}
                    disabled={isSubmitting}
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
                    className="p-2 border rounded"
                    disabled={isSubmitting}
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
                    className="w-5 h-5 accent-green-500"
                    disabled={isSubmitting}
                  />
                  <span>السيارة متاحة</span>
                </label>
              </div>

              {/* وصف السيارة */}
              <label className="flex flex-col w-full gap-2 mt-2">
                وصف السيارة
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="p-2 border rounded"
                  disabled={isSubmitting}
                />
              </label>

              {/* الصور القديمة */}
              {formData.existingImages?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.existingImages.map((img, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={img}
                        alt={`صورة ${i}`}
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
                </div>
              )}

              {/* الصور الجديدة */}
              <div className="mt-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="border-black  p-1 border-2"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.imageFiles.map((file, i) => (
                    <div key={i} className="relative">
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
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {isSubmitting ? "جاري التحديث..." : "تحديث السيارة"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
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

// ترجمة الماركات
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
    Peugeot: "بيجو",
    MG: "إم جي",
    Golf: "جولف",
  };
  return map[brand] || brand;
}
