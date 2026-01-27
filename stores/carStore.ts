// import { Car, DashboardStats } from "@/types/car";
// import { create } from "zustand";
// import { devtools } from "zustand/middleware";

// interface CarStore {
//   cars: Car[];
//   availableCars: Car[];
//   stats: DashboardStats | null;
//   currentCar: Car | null;
//   loading: boolean;
//   error: string | null;

//   fetchCars: () => Promise<void>;
//   fetchAvailableCars: () => Promise<void>;
//   fetchStats: () => Promise<void>;
//   fetchCarById: (id: number) => Promise<void>;
//   createCar: (carData: Omit<Car, "id">) => Promise<void>;
//   updateCar: (id: number, carData: Partial<Car>) => Promise<void>;
//   deleteCar: (id: number) => Promise<void>;
//   setCurrentCar: (car: Car | null) => void;
//   clearError: () => void;
// }

// export const useCarStore = create<CarStore>()(
//   devtools(
//     (set) => ({
//       cars: [],
//       availableCars: [], // ✅ مهم جدًا

//       stats: null,
//       currentCar: null,
//       loading: false,
//       error: null,

//       fetchStats: async () => {
//         set({ loading: true, error: null });
//         try {
//           const res = await fetch("/api/dashboard/stats", {
//             credentials: "include",
//           });

//           if (!res.ok) {
//             throw new Error("فشل في جلب الإحصائيات");
//           }

//           const stats = await res.json();
//           set({ stats, loading: false });
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "خطأ غير متوقع",
//             loading: false,
//           });
//         }
//       },

//       fetchCars: async () => {
//         set({ loading: true, error: null });
//         try {
//           const response = await fetch("/api/cars");
//           if (!response.ok) {
//             throw new Error("فشل في جلب السيارات");
//           }
//           const cars = await response.json();
//           set({ cars, loading: false });
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
//             loading: false,
//           });
//         }
//       },

//       fetchCarById: async (id: number) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await fetch(`/api/cars/${id}`);
//           if (!response.ok) {
//             throw new Error("فشل في جلب بيانات السيارة");
//           }
//           const car = await response.json();
//           set({ currentCar: car, loading: false });
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
//             loading: false,
//           });
//         }
//       },
//       fetchAvailableCars: async () => {
//         set({ loading: true, error: null });
//         try {
//           const res = await fetch("/api/cars/available");
//           if (!res.ok) throw new Error("فشل في جلب السيارات المتاحة");
//           const data = await res.json();
//           set({
//             availableCars: data.cars ?? data,
//             loading: false,
//           });
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "خطأ غير متوقع",
//             loading: false,
//           });
//         }
//       },

//       createCar: async (carData) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await fetch("/api/cars", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(carData),
//           });

//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || "فشل في إضافة السيارة");
//           }

//           const newCar = await response.json();
//           set((state) => ({
//             cars: [newCar, ...state.cars],
//             loading: false,
//           }));
//           return newCar;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
//             loading: false,
//           });
//           throw error;
//         }
//       },

//       updateCar: async (id, carData) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await fetch(`/api/cars/${id}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(carData),
//           });

//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || "فشل في تعديل السيارة");
//           }

//           const updatedCar = await response.json();
//           set((state) => ({
//             cars: state.cars.map((car) => (car.id === id ? updatedCar : car)),
//             currentCar:
//               state.currentCar?.id === id ? updatedCar : state.currentCar,
//             loading: false,
//           }));
//           return updatedCar;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
//             loading: false,
//           });
//           throw error;
//         }
//       },

//       deleteCar: async (id) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await fetch(`/api/cars/${id}`, {
//             method: "DELETE",
//           });

//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || "فشل في حذف السيارة");
//           }

//           set((state) => ({
//             cars: state.cars.filter((car) => car.id !== id),
//             availableCars: state.availableCars.filter((car) => car.id !== id), // ✅ أضف هذا
//             currentCar: state.currentCar?.id === id ? null : state.currentCar,
//             loading: false,
//           }));
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
//             loading: false,
//           });
//           throw error;
//         }
//       },

//       setCurrentCar: (car) => {
//         set({ currentCar: car });
//       },

//       clearError: () => {
//         set({ error: null });
//       },
//     }),
//     {
//       name: "car-store",
//     },
//   ),
// );
import { Car, DashboardStats } from "@/types/car";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CarStore {
  cars: Car[];
  availableCars: Car[];

  // ===== Pagination (ALL cars)
  carsCursor: number | null;
  carsHasMore: boolean;
  loadingCars: boolean;

  // ===== Pagination (AVAILABLE cars)
  availableCarsCursor: number | null;
  availableCarsHasMore: boolean;
  loadingAvailableCars: boolean;

  stats: DashboardStats | null;
  currentCar: Car | null;
  loading: boolean;
  error: string | null;

  fetchCars: (loadMore?: boolean) => Promise<void>;
  fetchAvailableCars: (loadMore?: boolean) => Promise<void>;
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
    (set, get) => ({
      cars: [],
      availableCars: [],

      // ===== Pagination defaults
      carsCursor: null,
      carsHasMore: true,
      loadingCars: false,

      availableCarsCursor: null,
      availableCarsHasMore: true,
      loadingAvailableCars: false,

      stats: null,
      currentCar: null,
      loading: false,
      error: null,

      // =========================
      // 📊 Dashboard stats
      // =========================
      fetchStats: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/dashboard/stats", {
            credentials: "include",
          });
          if (!res.ok) throw new Error("فشل في جلب الإحصائيات");
          const stats = await res.json();
          set({ stats });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "خطأ غير متوقع",
          });
        } finally {
          set({ loading: false });
        }
      },

      // =========================
      // 🚗 ALL cars (Pagination)
      // =========================
      fetchCars: async (loadMore = false) => {
        const { carsCursor, carsHasMore, loadingCars } = get();
        if (loadingCars) return;
        if (loadMore && !carsHasMore) return;

        set({ loadingCars: true, error: null });

        try {
          const query =
            loadMore && carsCursor ? `?cursor=${carsCursor}` : "";
          const res = await fetch(`/api/cars${query}`);
          if (!res.ok) throw new Error("فشل في جلب السيارات");

          const data = await res.json();

          set((state) => ({
            cars: loadMore ? [...state.cars, ...data.cars] : data.cars,
            carsCursor: data.nextCursor,
            carsHasMore: Boolean(data.nextCursor),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "خطأ غير متوقع",
          });
        } finally {
          set({ loadingCars: false });
        }
      },

      // =========================
      // ✅ AVAILABLE cars (Pagination)
      // =========================
      fetchAvailableCars: async (loadMore = false) => {
        const {
          availableCarsCursor,
          availableCarsHasMore,
          loadingAvailableCars,
        } = get();

        if (loadingAvailableCars) return;
        if (loadMore && !availableCarsHasMore) return;

        set({ loadingAvailableCars: true, error: null });

        try {
          const query =
            loadMore && availableCarsCursor
              ? `?cursor=${availableCarsCursor}`
              : "";

          const res = await fetch(`/api/cars/available${query}`);
          if (!res.ok) throw new Error("فشل في جلب السيارات المتاحة");

          const data = await res.json();

          set((state) => ({
            availableCars: loadMore
              ? [...state.availableCars, ...data.cars]
              : data.cars,
            availableCarsCursor: data.nextCursor,
            availableCarsHasMore: Boolean(data.nextCursor),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "خطأ غير متوقع",
          });
        } finally {
          set({ loadingAvailableCars: false });
        }
      },

      // =========================
      // 🚘 Single car
      // =========================
      fetchCarById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/cars/${id}`);
          if (!res.ok) throw new Error("فشل في جلب بيانات السيارة");
          const car = await res.json();
          set({ currentCar: car });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "خطأ غير متوقع",
          });
        } finally {
          set({ loading: false });
        }
      },

      // =========================
      // ➕ Create
      // =========================
      createCar: async (carData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/cars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData),
          });

          if (!res.ok) throw new Error("فشل في إضافة السيارة");
          const newCar = await res.json();

          set((state) => ({
            cars: [newCar, ...state.cars],
            availableCars:
              newCar.status === "available"
                ? [newCar, ...state.availableCars]
                : state.availableCars,
          }));

          return newCar;
        } finally {
          set({ loading: false });
        }
      },

      // =========================
      // ✏️ Update
      // =========================
      updateCar: async (id, carData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/cars/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData),
          });

          if (!res.ok) throw new Error("فشل في تعديل السيارة");
          const updatedCar = await res.json();

          set((state) => ({
            cars: state.cars.map((c) => (c.id === id ? updatedCar : c)),
            availableCars: state.availableCars
              .map((c) => (c.id === id ? updatedCar : c))
              .filter((c) => c.status === "available"),
            currentCar:
              state.currentCar?.id === id ? updatedCar : state.currentCar,
          }));

          return updatedCar;
        } finally {
          set({ loading: false });
        }
      },

      // =========================
      // 🗑 Delete
      // =========================
      deleteCar: async (id) => {
        set({ loading: true, error: null });
        try {
          await fetch(`/api/cars/${id}`, { method: "DELETE" });
          set((state) => ({
            cars: state.cars.filter((c) => c.id !== id),
            availableCars: state.availableCars.filter((c) => c.id !== id),
            currentCar:
              state.currentCar?.id === id ? null : state.currentCar,
          }));
        } finally {
          set({ loading: false });
        }
      },

      setCurrentCar: (car) => set({ currentCar: car }),
      clearError: () => set({ error: null }),
    }),
    { name: "car-store" }
  )
);
