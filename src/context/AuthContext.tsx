"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to safely get user from localStorage (only runs on client)
function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const storedUser = localStorage.getItem("securelytix_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state with stored user using lazy initializer
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock authentication - in production, this would be a real API call
    if (email && password) {
      const mockUser: User = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        role: "Admin",
        avatar: undefined,
      };
      
      setUser(mockUser);
      localStorage.setItem("securelytix_user", JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("securelytix_user");
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
