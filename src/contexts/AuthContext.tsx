import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { clearTokens, getAccessToken, saveTokens } from "../utils/tokenHelper";
import { logout as LogoutFunc, logoutThunk } from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";
import type { RootState } from "../app/store";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  // 🔹 Chỉ check token 1 lần khi mount
  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // 🔹 Cập nhật khi storage thay đổi (ví dụ refresh token)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!getAccessToken());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (access: string, refresh: string) => {
    saveTokens(access, refresh);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await dispatch(logoutThunk());
    setIsAuthenticated(false);
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
