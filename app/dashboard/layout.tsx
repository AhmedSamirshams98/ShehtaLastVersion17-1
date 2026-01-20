"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import UniLoading from "../components/shared/UniLoading";
import { DashboardNavbar } from "../components/dashboard-navbar";
import { Sidebar } from "../components/sidebar";
import { useUserStore } from "@/stores/userStore"; // استدعاء الـ store

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, fetchUser } = useUserStore(); // استخدم الـ store
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/login";
  const userRole = user?.role || "admin" || "superadmin";

  const restrictedRoutes = useMemo(
    () => [
      "/dashboard",
      "/dashboard/cars",
      "/dashboard/users",
      "/dashboard/forms",
    ],
    [],
  );

  const handleToggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    [],
  );
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    if (!isLoginPage && !user && !loading) {
      fetchUser();
    }
  }, [isLoginPage, user, loading, fetchUser]);

  // ===== حماية الصفحات =====
  useEffect(() => {
    if (
      !loading &&
      restrictedRoutes.includes(pathname) &&
      userRole !== "admin" &&
      userRole !== "superadmin"
    ) {
      router.replace("/");
    }
  }, [pathname, userRole, loading, router, restrictedRoutes]);

  if (loading) return <UniLoading />;
  if (isLoginPage) return <>{children}</>;
  if (
    restrictedRoutes.includes(pathname) &&
    userRole !== "admin" &&
    userRole !== "superadmin"
  )
    return null;

  return (
    <div className="flex min-h-screen flex-col" style={{ direction: "rtl" }}>
      <DashboardNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
