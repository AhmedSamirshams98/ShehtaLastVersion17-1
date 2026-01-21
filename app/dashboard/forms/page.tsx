"use client";

import { useState, useEffect } from "react";

interface FormData {
  id: number;
  customer_name: string;
  phone_number: string;
  car_brand: string;
  car_model: string;
  car_description?: string;
  status: string;
  created_at: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/form");
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يرجع بيانات JSON صحيحة");
      }
      const data = await response.json();
      setForms(data.forms || []);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (form: FormData) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedForm(null);
    setIsModalOpen(false);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (!selectedForm) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/form", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!response.ok) throw new Error("فشل في تحديث الحالة");

      setForms((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)),
      );
      setSelectedForm({ ...selectedForm, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendWhatsAppMessage = (phoneNumber: string, customerName: string) => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const egyptNumber = cleanNumber.startsWith("0")
      ? `20${cleanNumber.substring(1)}`
      : cleanNumber.startsWith("20")
        ? cleanNumber
        : `20${cleanNumber}`;
    const message = `مرحبا ${customerName}، نود إعلامكم أن طلبكم جاهز للتسليم. شكرا لتعاملكم معنا!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${egyptNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  const makePhoneCall = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const egyptNumber = cleanNumber.startsWith("0")
      ? `+20${cleanNumber.substring(1)}`
      : cleanNumber.startsWith("20")
        ? `+${cleanNumber}`
        : `+20${cleanNumber}`;
    window.location.href = `tel:${egyptNumber}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">جاري تحميل الطلبات...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-right">
        إدارة طلبات السيارات
      </h1>

      {forms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg text-gray-500">لا توجد طلبات حالياً</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2">الاسم</th>
                <th className="border px-4 py-2">رقم الهاتف</th>
                <th className="border px-4 py-2">ماركة السيارة</th>
                <th className="border px-4 py-2">موديل السيارة</th>
                <th className="border px-4 py-2">الحالة</th>
                <th className="border px-4 py-2">تاريخ الإنشاء</th>
                <th className="border px-4 py-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr
                  key={form.id}
                  className="text-center hover:bg-gray-50 transition-colors"
                >
                  <td className="border px-4 py-2">{form.customer_name}</td>
                  <td className="border px-4 py-2">{form.phone_number}</td>
                  <td className="border px-4 py-2">{form.car_brand}</td>
                  <td className="border px-4 py-2">{form.car_model}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        form.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {form.status === "completed" ? "مكتمل" : "معلق"}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(form.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => openModal(form)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      عرض / تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedForm && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">تفاصيل الطلب</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    الاسم الكامل
                  </label>
                  <p className="mt-1 text-gray-800">
                    {selectedForm.customer_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    رقم الهاتف
                  </label>
                  <p className="mt-1 text-gray-800">
                    {selectedForm.phone_number}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    ماركة السيارة
                  </label>
                  <p className="mt-1 text-gray-800">{selectedForm.car_brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    موديل السيارة
                  </label>
                  <p className="mt-1 text-gray-800">{selectedForm.car_model}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium  text-gray-600">
                  الوصف
                </label>
                <p className="mt-1 text-gray-800 break-words   border rounded p-2">
                  {selectedForm.car_description || "لا يوجد وصف إضافي"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    تاريخ الإنشاء
                  </label>
                  <p className="mt-1 text-gray-800">
                    {new Date(selectedForm.created_at).toLocaleDateString(
                      "ar-SA",
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedForm.id, "completed")}
                    disabled={
                      selectedForm.status === "completed" || isSubmitting
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedForm.status === "completed"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    تعيين كمكتمل
                  </button>

                  <button
                    onClick={() => updateStatus(selectedForm.id, "pending")}
                    disabled={selectedForm.status === "pending" || isSubmitting}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedForm.status === "pending"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    تعيين كمعلق
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    sendWhatsAppMessage(
                      selectedForm.phone_number,
                      selectedForm.customer_name,
                    )
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  إرسال واتساب
                </button>

                <button
                  onClick={() => makePhoneCall(selectedForm.phone_number)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  اتصال هاتفي
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
