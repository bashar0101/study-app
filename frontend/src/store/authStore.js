import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  register: async ({ name, email, password }) => {
    const data = await api.post("/auth/register", { name, email, password });
    return data;
  },

  login: async ({ email, password }) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    set({ user: data.user, isAuthenticated: true, isLoading: false });
    return data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem("accessToken");
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const data = await api.get("/users/me");
      set({ user: data.user || data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("accessToken");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    const data = await api.patch("/users/me", updates);
    set({ user: data.user || data });
    return data;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const data = await api.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return data;
  },

  verifyEmail: async (token) => {
    const data = await api.post("/auth/verify-email", { token });
    return data;
  },

  forgotPassword: async (email) => {
    const data = await api.post("/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async ({ token, password }) => {
    const data = await api.post("/auth/reset-password", { token, password });
    return data;
  },
}));

export default useAuthStore;
