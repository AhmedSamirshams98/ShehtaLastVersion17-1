"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import shehtalogo from "../../public/images/logo.svg";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import { ConfirmationModal } from "./shared/ConfirmationModal";

import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

type DashboardNavbarProps = {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export function DashboardNavbar({
  isSidebarOpen = false,
  onToggleSidebar,
}: DashboardNavbarProps) {
  const router = useRouter();

  const { user, loading, fetchUser, logout } = useUserStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // جلب المستخدم عند تحميل الصفحة
  useEffect(() => {
    fetchUser().then((data) => {
      if (!useUserStore.getState().user) {
        router.replace("/dashboard/login");
      }
    });
  }, [fetchUser, router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLogoutLoading(false);
      setIsLogoutModalOpen(false);
    }
  };

  if (loading) {
    return (
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-[#3b2606ee] text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button
            className="lg:hidden"
            onClick={() => onToggleSidebar?.()}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <Link
            href="/dashboard"
            className="hidden text-xl font-semibold lg:inline-flex"
          >
            <Image src={shehtalogo} alt="logo" width={40} height={40} />
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="flex flex-col items-end">
                <span className="text-sm text-white font-semibold leading-tight">
                  {user.name}
                </span>
                <span className="text-xs text-white capitalize mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            disabled={logoutLoading}
          >
            {logoutLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </Button>
        </div>
      </div>

      {/* Modal */}
      <ConfirmationModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        title="تأكيد تسجيل الخروج"
        description="هل أنت متأكد من رغبتك في تسجيل الخروج؟"
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        variant="default"
        onConfirm={handleLogout}
        icon={<LogOut className="h-8 w-8" />}
      />
    </nav>
  );
}
