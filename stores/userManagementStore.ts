// /stores/userManagementStore.ts
import { create } from "zustand";
import axios from "axios";

export interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

interface UserManagementStore {
  users: User[];
  loading: boolean;
  currentUser: User | null;
  showPopup: boolean;
  newUser: { name: string; email: string; password: string; role: string };

  fetchSession: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  updateRole: (id: number, role: string) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  addUser: () => Promise<void>;
  setShowPopup: (value: boolean) => void;
  setNewUser: (data: Partial<{ name: string; email: string; password: string; role: string }>) => void;
}

export const useUserManagementStore = create<UserManagementStore>((set, get) => ({
  users: [],
  loading: true,
  currentUser: null,
  showPopup: false,
  newUser: { name: "", email: "", password: "", role: "user" },

  setShowPopup: (value) => set({ showPopup: value }),
  setNewUser: (data) => set({ newUser: { ...get().newUser, ...data } }),

  fetchSession: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      const user = res.data.user;
      if (!user || user.role !== "superadmin") {
        alert("ليس لديك صلاحية الوصول إلى هذه الصفحة");
        window.location.href = "/";
        return;
      }
      set({ currentUser: user });
      await get().fetchUsers();
    } catch (err) {
      console.error(err);
      window.location.href = "/login";
    } finally {
      set({ loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/api/users");
      set({ users: data.users });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateRole: async (id, role) => {
    try {
      await axios.put(`/api/users/${id}`, { role });
      await get().fetchUsers();
    } catch (err) {
      console.error(err);
    }
  },

  deleteUser: async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      await get().fetchUsers();
    } catch (err) {
      console.error(err);
    }
  },

  addUser: async () => {
    const { newUser } = get();
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("جميع الحقول مطلوبة!");
      return;
    }
    try {
      const res = await axios.post("/api/users", newUser);
      if (res.status === 200 || res.status === 201) {
        await get().fetchUsers();
        set({ showPopup: false, newUser: { name: "", email: "", password: "", role: "user" } });
      } else {
        alert(res.data.error || "حدث خطأ أثناء إضافة المستخدم");
      }
    } catch (err) {
      console.error(err);
    }
  },
}));
