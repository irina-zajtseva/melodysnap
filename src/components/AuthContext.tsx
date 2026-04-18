"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  userId: string;
  email: string;
  name: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return data.error || "Login failed";
      }

      // Refresh user data
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);
      return null; // null means success (no error)
    } catch {
      return "Something went wrong. Please try again.";
    }
  };

  const register = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return data.error || "Registration failed";
      }

      // Auto-login after registration
      return await login(email, password);
    } catch {
      return "Something went wrong. Please try again.";
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);