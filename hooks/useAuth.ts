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
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync with localStorage on mount and listen for storage changes
  // Token is stored in httpOnly cookie and is automatically sent with requests
  useEffect(() => {
    // Function to load auth state from localStorage
    // Only user data is stored in localStorage (NOT token - token is in httpOnly cookie)
    const loadAuthState = () => {
      const storedUser = localStorage.getItem("user");

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
    };

    // Initial load
    loadAuthState();
    setIsHydrated(true);

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
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
    // Clear user data from localStorage
    localStorage.removeItem("user");
    setUser(null);

    // Call logout endpoint to clear httpOnly cookie
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // Include cookies in request
    }).catch(() => {
      // Silently fail if logout endpoint doesn't exist yet
    });
  }, []);

  const login = useCallback((userData: User) => {
    // Only store user data (NOT token) in localStorage
    // Token is automatically stored in httpOnly cookie by the API
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const isStudent = user?.role === "student";
  const isPGOwner = user?.role === "pg_owner";
  const isSuperAdmin = user?.role === "superadmin";

  return {
    user,
    isAuthenticated,
    isHydrated,
    login,
    logout,
    isStudent,
    isPGOwner,
    isSuperAdmin,
  };
}