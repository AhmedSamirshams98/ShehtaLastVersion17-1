import { create } from "zustand";

interface Video {
  id: number;
  src: string;
}

interface VideoStore {
  reels: Video[];
  clients: Video[];
  fetchReels: () => Promise<void>;
  fetchClients: () => Promise<void>;
  addReel: (src: string) => Promise<void>;
  addClient: (src: string) => Promise<void>;
  removeReel: (id: number) => Promise<void>;
  removeClient: (id: number) => Promise<void>;
  updateReel: (id: number, src: string) => Promise<void>;
  updateClient: (id: number, src: string) => Promise<void>;
  makeLatestReel: (id: number) => Promise<void>;
  
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  reels: [],
  clients: [],

  // جلب البيانات من الـ API
  fetchReels: async () => {
    try {
      const res = await fetch("/api/reels");
      const data = await res.json();
      set({ reels: data });
    } catch (error) {
      console.error("Failed to fetch reels", error);
    }
  },
  

  // جلب فيديوهات العملاء من DB
  fetchClients: async () => {
    const res = await fetch("/api/clients-videos");
    const data = await res.json();
    set({ clients: data });
  },

  // إضافة Reel جديد
  addReel: async (src: string) => {
    const res = await fetch("/api/reels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const data = await res.json();
    if (res.ok) set((state) => ({ reels: [...state.reels, data] }));
  },

  // إضافة ClientVideo جديد
  addClient: async (src: string) => {
    const res = await fetch("/api/clients-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const data = await res.json();
    if (res.ok) set((state) => ({ clients: [...state.clients, data] }));
  },

  // حذف Reel
  removeReel: async (id: number) => {
    await fetch(`/api/reels?id=${id}`, { method: "DELETE" });
    set((state) => ({ reels: state.reels.filter((v) => v.id !== id) }));
  },

  // حذف ClientVideo
  removeClient: async (id: number) => {
    await fetch(`/api/clients-videos?id=${id}`, { method: "DELETE" });
    set((state) => ({ clients: state.clients.filter((v) => v.id !== id) }));
  },

  // تحديث Reel
  updateReel: async (id: number, src: string) => {
    // يمكن إضافة endpoint PATCH إذا أردت تحديث DB
    set((state) => ({
      reels: state.reels.map((v) => (v.id === id ? { ...v, src } : v)),
    }));
  },

  // تحديث ClientVideo
  updateClient: async (id: number, src: string) => {
    set((state) => ({
      clients: state.clients.map((v) => (v.id === id ? { ...v, src } : v)),
    }));
  },
    // === دوال جعل الفيديو الأخير هو الأحدث ===
  makeLatestReel: async (id: number) => {
    try {
      await fetch("/api/reels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, makeLatest: true}),
      });
      get().fetchReels(); // إعادة تحميل الفيديوهات
    } catch (err) {
      console.error(err);
    }
  },
}));
