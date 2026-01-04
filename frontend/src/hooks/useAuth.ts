import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await authService.me(); // backend reads JWT cookie
        setUser(me); // store user info
      } catch {
        setUser(null); // not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // LOGIN function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user); // store logged-in user
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout, setUser };
};
