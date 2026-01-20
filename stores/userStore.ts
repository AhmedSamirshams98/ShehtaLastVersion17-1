// /stores/userStore.ts
import { create } from "zustand";
import axios from "axios";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/api/auth/me", { withCredentials: true });
      set({ user: data.user, loading: false });
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ user: null, loading: false });
    }
  },
  setUser: (user) => set({ user }),
}));
