import { NavLink } from "@/types/car";
import {
  FaCar,
  FaClipboardList,
  FaComments,
  FaInfoCircle,
  FaPhone,
  FaVideo,
} from "react-icons/fa";

export const mainNavLinks: NavLink[] = [
  { id: 1, name: "عن شحتة", path: "/#about", icon: FaInfoCircle },
  { id: 2, name: "المعروضات", path: "/#cars", icon: FaCar },
  { id: 3, name: "اطلب سيارتك الآن", path: "/form", icon: FaClipboardList },
  { id: 4, name: "أحدث الفيديوهات", path: "/#reels", icon: FaVideo },
  { id: 5, name: "آراء العملاء", path: "/#clients", icon: FaComments },
  { id: 6, name: "تواصل معنا", path: "/#contact", icon: FaPhone },
];

export const dashboardNavLinks: NavLink[] = [
  { id: 1, name: "لوحة تحكم السيارات", path: "/dashboard/cars" },
  { id: 2, name: "لوحة تحكم الطلبات", path: "/dashboard/forms" },
  { id: 3, name: "لوحة تحكم المستخدمين", path: "/dashboard/users" },
];
