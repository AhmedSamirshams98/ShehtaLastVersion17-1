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

  const deleteUser = async (id: number) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
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

      {/* Scrollable table for small screens */}
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
                <td className="px-4 py-2 text-right">
                  {user.name || "غير محدد"}
                </td>
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
    </div>
  );
};

export default DashboardUsersPage;
