import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { authService } from "../services/authService";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    ownerName: string;
    ownerEmail: string;
    password: string;
    companyName: string;
    planId: number;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.me();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (data: {
    ownerName: string;
    ownerEmail: string;
    password: string;
    companyName: string;
    planId: number;
  }) => {
    const response = await authService.register(data);
    const { token, owner } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(owner));
    setUser(owner);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
