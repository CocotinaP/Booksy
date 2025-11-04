import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import ProtectedViews from "./layout/ProtectedViews";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BooksPage from "./pages/BooksPage";

const theme = createTheme();


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected area */}
            <Route element={
                <RequireAuth>
                  <ProtectedViews />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="books" element={<BooksPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
