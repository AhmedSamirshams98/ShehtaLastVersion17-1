"use client";

import React, { useEffect, useState } from "react";
import { FaCar, FaCheckCircle, FaClipboardList, FaUser } from "react-icons/fa"; // استيراد الأيقونات

interface DashboardStats {
  totalCars: number;
  availableCars: number;
  totalOrders: number;
  totalUsers: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="px-[12%] py-[2%] space-y-6">
      <h1 className="text-2xl font-bold text-center">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* إجمالي عدد السيارات */}
        <div className="bg-white p-2 rounded-lg shadow flex flex-col items-center">
          <FaCar className="text-2xl text-blue-500 mb-2" />
          <h2 className="text-gray-500">عدد السيارات</h2>
          <p className="text-3xl font-bold">{stats.totalCars}</p>
        </div>

        {/* عدد السيارات المتاحة */}
        <div className="bg-white p-2 rounded-lg shadow flex flex-col items-center">
          <FaCheckCircle className="text-2xl text-green-500 mb-2" />
          <h2 className="text-gray-500">عدد السيارات المتاحة</h2>
          <p className="text-3xl font-bold">{stats.availableCars}</p>
        </div>

        <div className="bg-white p-2 rounded-lg shadow flex flex-col items-center">
          <FaClipboardList className="text-2xl text-yellow-500 mb-2" />
          <h2 className="text-gray-500">عدد الطلبات</h2>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow flex flex-col items-center hover:shadow-lg cursor-pointer transition">
          <FaUser className="text-2xl text-purple-500 mb-2" />
          <h2 className="text-gray-500">عدد المستخدمين</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
