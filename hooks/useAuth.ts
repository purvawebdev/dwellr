"use client";

import { useState, useCallback, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "pg_owner" | "superadmin";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync with localStorage on mount and listen for storage changes
  useEffect(() => {
    // Function to load auth state from localStorage
    const loadAuthState = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken");

      try {
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        setUser(null);
      }

      setToken(storedToken || null);
    };

    // Initial load
    loadAuthState();
    setIsHydrated(true);

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "authToken") {
        loadAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isAuthenticated = user !== null;

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback((userData: User, authToken: string) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  }, []);

  const isStudent = user?.role === "student";
  const isPGOwner = user?.role === "pg_owner";
  const isSuperAdmin = user?.role === "superadmin";

  return {
    user,
    token,
    isAuthenticated,
    isHydrated,
    login,
    logout,
    isStudent,
    isPGOwner,
    isSuperAdmin,
  };
}