export interface CarImage {
  id: number;
  image_url: string;
  car_id: number;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: string;
  description: string;
  kilometers: number;
  status: string;
  car_images: CarImage[]; // ✅ لا يمكن أن تكون undefined بعد تحميل البيانات من Prisma
    images?: string[]; // ✅ أضف هذا لتجنب الخطأ

}


export interface CarFormData {
  brand: string;
  model: string;
  year: number;
  condition: string;
  kilometers?: number;
  description?: string;
  status: string;
  imageFiles: File[];
  existingImages: string[];
}

export interface CarResponse {
  id: number;
  brand: string;
  model: string;
  year: number; // إضافة
  condition: string; // إضافة
  description?: string;
  kilometers?: number;  
  status: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}
import { IconType } from "react-icons/lib";

export interface NavLink {
  id: number;
  name: string;
  path: string;
  icon?: IconType; // أيقونة اختيارية
}
export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  totalOrders: number;
  totalUsers: number;
}
