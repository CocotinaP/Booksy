import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { authApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refresh"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!accessToken;

  // 🔄 Sync token across browser tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "access") setAccessToken(e.newValue);
      if (e.key === "refresh") setRefreshToken(e.newValue);
      if (e.key === "user") setUser(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);


  // 🔐 Login
  const login = async ({ username, password }) => {
    try {
      const { access, refresh, user } = await authApi.login({ username, password });

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // backend may not require logout
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // 💡 Value exposed to context consumers
  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [accessToken, refreshToken, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
