import { create } from "zustand";
import axios from "axios";

export interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;

  users: User[];
  currentUser: User | null;
  showPopup: boolean;
  newUser: { name: string; email: string; password: string; role: string };

  fetchSession: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchUser: () => Promise<void>;
  addUser: () => Promise<void>;
  updateRole: (id: number, role: string) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  logout: () => Promise<void>;

  setUser: (user: User | null) => void;
  setShowPopup: (value: boolean) => void;
  setNewUser: (data: Partial<{ name: string; email: string; password: string; role: string }>) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  users: [],
  currentUser: null,
  showPopup: false,
  newUser: { name: "", email: "", password: "", role: "user" },

  setUser: (user) => set({ user }),
  setShowPopup: (value) => set({ showPopup: value }),
  setNewUser: (data) => set({ newUser: { ...get().newUser, ...data } }),

  fetchSession: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      const user = res.data.user;

      if (!user || !["admin", "superadmin"].includes(user.role)) {
        alert("ليس لديك صلاحية الوصول إلى هذه الصفحة");
        window.location.href = "/";
        return;
      }

      set({ currentUser: user, user });
      await get().fetchUsers();
    } catch (err) {
      console.error(err);
      window.location.href = "/login";
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/api/auth/me", { withCredentials: true });
      set({ user: data.user || null });
    } catch (err) {
      console.error(err);
      set({ user: null });
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
        set({
          showPopup: false,
          newUser: { name: "", email: "", password: "", role: "user" },
        });
      } else {
        alert(res.data.error || "حدث خطأ أثناء إضافة المستخدم");
      }
    } catch (err) {
      console.error(err);
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

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      set({ user: null, currentUser: null });
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
