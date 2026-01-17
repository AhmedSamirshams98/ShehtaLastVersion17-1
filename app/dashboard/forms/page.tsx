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

interface NestedListItem {
  id: number;
  isOpen: boolean;
  data: FormData;
}

export default function FormsPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [nestedItems, setNestedItems] = useState<NestedListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (forms.length > 0) {
      setNestedItems(
        forms.map((form) => ({
          id: form.id,
          isOpen: false,
          data: form,
        }))
      );
    }
  }, [forms]);

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/form");

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يرجع بيانات JSON صحيحة");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل في جلب البيانات");
      }

      setForms(data.forms || []);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch("/api/form", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("فشل في تحديث الحالة");
      }

      // const data = await response.json();

      setForms(
        forms.map((form) =>
          form.id === id ? { ...form, status: newStatus } : form
        )
      );
      fetchForms();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleItem = (id: number) => {
    setNestedItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const closeAllItems = () => {
    setNestedItems((items) =>
      items.map((item) => ({ ...item, isOpen: false }))
    );
  };

  // WhatsApp message function
  const sendWhatsAppMessage = (phoneNumber: string, customerName: string) => {
    // Clean phone number - remove any non-digit characters and add Egypt country code
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const egyptNumber = cleanNumber.startsWith("0")
      ? `20${cleanNumber.substring(1)}`
      : cleanNumber.startsWith("20")
      ? cleanNumber
      : `20${cleanNumber}`;

    // Ready message in Arabic
    const message = `مرحبا ${customerName}، نود إعلامكم أن طلبكم  الذي تم من خلال موقعنا الالكتروني شحته للتجاره  جاهز للتسليم. شكرا لتعاملكم معنا!`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${egyptNumber}?text=${encodedMessage}`;

    // Open in new tab
    window.open(whatsappUrl, "_blank");
  };

  // Phone call function
  const makePhoneCall = (phoneNumber: string) => {
    // Clean phone number for tel: link
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const egyptNumber = cleanNumber.startsWith("0")
      ? `+20${cleanNumber.substring(1)}`
      : cleanNumber.startsWith("20")
      ? `+${cleanNumber}`
      : `+20${cleanNumber}`;

    // Create tel link
    const telUrl = `tel:${egyptNumber}`;

    // Redirect to phone call
    window.location.href = telUrl;
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
      <div className="flex flex-col gap-2 justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          إدارة طلبات السيارات
        </h1>
      </div>

      <div className="max-w-4xl mx-auto" style={{ direction: "rtl" }}>
        {forms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg text-gray-500">لا توجد طلبات حالياً</p>
          </div>
        ) : (
          <div className="relative bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={closeAllItems}
              className="absolute left-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-gray-600"
            >
              إغلاق الكل
            </button>

            <h2 className="text-xl font-semibold mb-4 text-black">
              الطلبات ({forms.length})
            </h2>

            <div className="space-y-3">
              {nestedItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Header - Always Visible */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-all flex justify-between items-center"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black">
                        {item.data.customer_name}
                      </h3>
                      <p className="text-black">
                        {item.data.car_brand} - {item.data.car_model}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.data.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.data.status === "completed" ? "مكتمل" : "مغلق"}
                      </span>

                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          item.isOpen ? "rotate-180" : ""
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
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {item.isOpen && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            الاسم الكامل
                          </label>
                          <p className="mt-1 text-gray-800">
                            {item.data.customer_name}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            رقم الهاتف
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-gray-800 dir-ltr text-right flex-1">
                              {item.data.phone_number}
                            </p>
                            <div className="flex gap-2">
                              {/* WhatsApp Icon */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendWhatsAppMessage(
                                    item.data.phone_number,
                                    item.data.customer_name
                                  );
                                }}
                                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                title="إرسال رسالة واتساب"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.189-3.553-8.449" />
                                </svg>
                              </button>

                              {/* Phone Icon */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  makePhoneCall(item.data.phone_number);
                                }}
                                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                title="اتصال هاتفي"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z" />
                                  <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a1 1 0 00-.086-1.391l-4.064-3.696z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            ماركة السيارة
                          </label>
                          <p className="mt-1 text-gray-800">
                            {item.data.car_brand}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            موديل السيارة
                          </label>
                          <p className="mt-1 text-gray-800">
                            {item.data.car_model}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">
                          الوصف
                        </label>
                        <p className="mt-1 text-gray-800 bg-white p-3 rounded border min-h-[60px]">
                          {item.data.car_description || "لا يوجد وصف إضافي"}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            تاريخ الإنشاء
                          </label>
                          <p className="mt-1 text-gray-800">
                            {new Date(item.data.created_at).toLocaleDateString(
                              "ar-SA"
                            )}
                          </p>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateStatus(item.id, "completed")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              item.data.status === "completed"
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            disabled={item.data.status === "completed"}
                          >
                            تعيين كمكتمل
                          </button>

                          <button
                            onClick={() => updateStatus(item.id, "pending")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              item.data.status === "pending"
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-yellow-500 text-white hover:bg-yellow-600"
                            }`}
                            disabled={item.data.status === "pending"}
                          >
                            تعيين كمعلق
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
