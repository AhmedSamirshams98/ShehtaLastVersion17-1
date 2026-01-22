"use client";

import { useUserStore } from "@/stores/userStore";
import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const DashboardUsersPage = () => {
  const {
    users,
    loading,
    fetchSession,
    updateRole,
    deleteUser,
    addUser,
    showPopup,
    setShowPopup,
    newUser,
    setNewUser,
  } = useUserStore();

  useEffect(() => {
    fetchSession();
  }, []);

  if (loading) return <p>جاري التحقق من الصلاحيات...</p>;

  return (
    <div className="px-[8%] p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-6 text-center">
          لوحة تحكم المستخدمين
        </h1>
        <button
          onClick={() => setShowPopup(true)}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          إضافة مستخدم جديد
        </button>
      </div>

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

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">إضافة مستخدم جديد</h2>
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="الاسم"
              value={newUser.name}
              onChange={(e) => setNewUser({ name: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="الإيميل"
              value={newUser.email}
              onChange={(e) => setNewUser({ email: e.target.value })}
            />
            <input
              type="password"
              className="w-full mb-2 p-2 border rounded"
              placeholder="كلمة المرور"
              value={newUser.password}
              onChange={(e) => setNewUser({ password: e.target.value })}
            />
            <select
              className="w-full mb-4 p-2 border rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ role: e.target.value })}
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
                onClick={addUser}
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
