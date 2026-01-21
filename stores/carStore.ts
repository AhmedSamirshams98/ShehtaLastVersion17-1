import { Car, DashboardStats } from "@/types/car";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CarStore {
  cars: Car[];
  availableCars: Car[];
  stats: DashboardStats | null;
  currentCar: Car | null;
  loading: boolean;
  error: string | null;

  fetchCars: () => Promise<void>;
  fetchAvailableCars: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchCarById: (id: number) => Promise<void>;
  createCar: (carData: Omit<Car, "id">) => Promise<void>;
  updateCar: (id: number, carData: Partial<Car>) => Promise<void>;
  deleteCar: (id: number) => Promise<void>;
  setCurrentCar: (car: Car | null) => void;
  clearError: () => void;
}

export const useCarStore = create<CarStore>()(
  devtools(
    (set) => ({
      cars: [],
      availableCars: [], // ✅ مهم جدًا

      stats: null,
      currentCar: null,
      loading: false,
      error: null,

      fetchStats: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/dashboard/stats", {
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error("فشل في جلب الإحصائيات");
          }

          const stats = await res.json();
          set({ stats, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "خطأ غير متوقع",
            loading: false,
          });
        }
      },

      fetchCars: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/cars");
          if (!response.ok) {
            throw new Error("فشل في جلب السيارات");
          }
          const cars = await response.json();
          set({ cars, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
            loading: false,
          });
        }
      },

      fetchCarById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/cars/${id}`);
          if (!response.ok) {
            throw new Error("فشل في جلب بيانات السيارة");
          }
          const car = await response.json();
          set({ currentCar: car, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
            loading: false,
          });
        }
      },
      fetchAvailableCars: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/cars/available");
          if (!res.ok) throw new Error("فشل في جلب السيارات المتاحة");
          const data = await res.json();
          set({
            availableCars: data.cars ?? data,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "خطأ غير متوقع",
            loading: false,
          });
        }
      },

      createCar: async (carData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/cars", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(carData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "فشل في إضافة السيارة");
          }

          const newCar = await response.json();
          set((state) => ({
            cars: [newCar, ...state.cars],
            loading: false,
          }));
          return newCar;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
            loading: false,
          });
          throw error;
        }
      },

      updateCar: async (id, carData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/cars/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(carData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "فشل في تعديل السيارة");
          }

          const updatedCar = await response.json();
          set((state) => ({
            cars: state.cars.map((car) => (car.id === id ? updatedCar : car)),
            currentCar:
              state.currentCar?.id === id ? updatedCar : state.currentCar,
            loading: false,
          }));
          return updatedCar;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
            loading: false,
          });
          throw error;
        }
      },

      deleteCar: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/cars/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "فشل في حذف السيارة");
          }

          set((state) => ({
            cars: state.cars.filter((car) => car.id !== id),
            availableCars: state.availableCars.filter((car) => car.id !== id), // ✅ أضف هذا
            currentCar: state.currentCar?.id === id ? null : state.currentCar,
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
            loading: false,
          });
          throw error;
        }
      },

      setCurrentCar: (car) => {
        set({ currentCar: car });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "car-store",
    },
  ),
);
