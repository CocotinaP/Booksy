import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import ProtectedViews from "./layout/ProtectedViews";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import Books from "./Pages/BooksPage";

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
              <Route path="books" element={<Books />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
