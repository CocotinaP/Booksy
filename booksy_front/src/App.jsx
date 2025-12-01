import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import ProtectedViews from "./layout/ProtectedViews";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import BooksListPage from "./Pages/BooksListPage"; 
import BookViewPage from "./Pages/BookViewPage";
import RegisterPage from "./Pages/RegisterPage";
import RequestsListPage from "./Pages/RequestsListPage";
import RequestsPage from "./Pages/RequestsPage";
import AnnouncementsPage from "./Pages/AnnouncementsPage";
import AnnouncementResponsesPage from "./Pages/AnnouncementResponsesPage";


const theme = createTheme();


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <ProtectedViews />
                </RequireAuth>
              }>
              <Route index element={<Dashboard />} />
              <Route path="listbooks" element={<BooksListPage />}>
                <Route path=":bookId" element={<BookViewPage />} />
              </Route>

              {/*<Route path="requests" element={<RequestsListPage/>}/>*/}
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/book-announcements" element={<AnnouncementsPage />} />
                <Route path="/book-announcements/:announcementId/responses" element={<AnnouncementResponsesPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}