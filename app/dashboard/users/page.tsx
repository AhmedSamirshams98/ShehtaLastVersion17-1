"use client";

import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

const DashboardUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const router = useRouter();

  // جلب بيانات الجلسة الحالية للتحقق من الدور
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      const data = await res.json();
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setCurrentUser(data.user);

      // إذا لم يكن superadmin، إعادة التوجيه
      if (data.user.role !== "superadmin") {
        alert("ليس لديك صلاحية الوصول إلى هذه الصفحة");
        router.replace("/"); // إعادة التوجيه للصفحة الرئيسية
        return;
      }

      // بعد التأكد من الصلاحية، جلب المستخدمين
      fetchUsers();
    } catch (err) {
      console.error(err);
      router.replace("/");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // تحديث الدور
  const updateRole = async (id: number, role: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // حذف مستخدم
  const deleteUser = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // إضافة مستخدم جديد
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("جميع الحقول مطلوبة!");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "حدث خطأ أثناء إضافة المستخدم");
        return;
      }
      fetchUsers();
      setShowPopup(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>جاري التحقق من الصلاحيات...</p>;

  return (
    <div className="px-[8%] p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        لوحة تحكم المستخدمين
      </h1>

      {/* زر إضافة مستخدم */}
      <button
        onClick={() => setShowPopup(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        إضافة مستخدم جديد
      </button>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-right text-gray-700">الاسم</th>
              <th className="px-4 py-2 text-right text-gray-700">الإيميل</th>
              <th className="px-4 py-2 text-right text-gray-700">الدور</th>
              <th className="px-4 py-2 text-center text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-right">{user.name || "غير محدد"}</td>
                <td className="px-4 py-2 text-right">{user.email}</td>
                <td className="px-4 py-2 text-right">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1 w-full md:w-auto"
                  >
                    <option value="user">مستخدم</option>
                    <option value="admin">أدمن</option>
                    <option value="superadmin">سوبر أدمن</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup لإضافة مستخدم */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">إضافة مستخدم جديد</h2>
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="الاسم"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="الإيميل"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              className="w-full mb-2 p-2 border rounded"
              placeholder="كلمة المرور"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              className="w-full mb-4 p-2 border rounded"
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="user">مستخدم</option>
              <option value="admin">أدمن</option>
              <option value="superadmin">سوبر أدمن</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowPopup(false)}
              >
                إلغاء
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddUser}
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUsersPage;
