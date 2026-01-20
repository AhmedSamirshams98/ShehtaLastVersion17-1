"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarIcon, HomeIcon, UsersIcon, ClipboardList, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "antd";
import logo from "../../public/images/logo.svg";
const sidebarItems = [
  {
    title: "الرئيسية",
    href: "/dashboard",
    icon: HomeIcon,
    roles: ["admin", "superadmin"], // كل الأدوار يمكنها الوصول
  },
  {
    title: "المستخدمين",
    href: "/dashboard/users",
    icon: UsersIcon,
    roles: ["admin", "superadmin"], // فقط admin
  },
  {
    title: "السيارات",
    href: "/dashboard/cars",
    icon: CarIcon,
    roles: ["admin", "superadmin"], // admin و manager
  },
  {
    title: "الطلبات",
    href: "/dashboard/forms",
    icon: ClipboardList,
    roles: ["admin", "superadmin"], // فقط admin
  },
];

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const handleClose = () => onClose?.();

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return null;

  const userRole = user?.role || "manager";

  // Filter sidebar items based on role
  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex min-h-[93vh] bg-sidebar flex-col border-r border-border  transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
        )}
        aria-label="Sidebar navigation"
      >
        {/* Top logo & close button (mobile) */}
        <div className="flex items-center justify-between bg-primary border-b border-border p-4 lg:hidden">
          <Link href="/dashboard" className="flex items-center">
            <Image src={logo} alt="logo" width={30} height={30} priority />
          </Link>
          <Button onClick={handleClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar links */}
        <div className="flex-1 space-y-2 p-4 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/dashboard/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={handleClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300 ease-out",
                    isActive
                      ? "scale-110 rotate-6"
                      : "group-hover:scale-125 group-hover:rotate-12",
                  )}
                />
                <span
                  className={cn(
                    "flex-1 transition-all duration-300",
                    !isActive && "group-hover:-translate-x-1",
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-border bg-muted/30 mt-auto text-center">
          <div className="px-4 py-3 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} شحتة للتجارة
            </p>
            <Link
              href="https://wa.me/201000030607"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 underline"
            >
              Made With ❤️ By: Rafeeq.Academy Teams
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
