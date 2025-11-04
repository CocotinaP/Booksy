// src/api/index.js
import { createHttpClient } from "./httpClient";          // your booksHttpClient.js
import { createBookApi } from "../features/books/bookApi"; // your bookApi.js
import { createAuthApi } from "../features/auth/authApi";  // from earlier

const http = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  getToken: () => localStorage.getItem("token"), // stays dynamic per request
});

export const bookApi = createBookApi(http);
export const authApi = createAuthApi(http);
