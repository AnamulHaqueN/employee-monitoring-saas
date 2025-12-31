import api from "../config/axios";
import type { User } from "../types";

export const authService = {
  async register(data: {
    ownerName: string;
    ownerEmail: string;
    password: string;
    companyName: string;
    planId: number;
  }) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
  },

  async logout() {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async me(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data.data;
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
