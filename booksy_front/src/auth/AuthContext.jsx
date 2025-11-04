import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // (Optional) Keep token in sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") setToken(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async ({ email, password }) => {
    // TODO: replace with real API call
    // const { token } = await api.login({ email, password });
    const demo = "demo-jwt";
    localStorage.setItem("token", demo);
    setToken(demo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = useMemo(() => ({
    token,
    isAuthenticated: !!token,
    login,
    logout,
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
