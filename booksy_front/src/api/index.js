// src/api/index.js
import { createHttpClient } from "./httpClient";          // your booksHttpClient.js
import { createBookApi } from "../features/books/bookApi"; // your bookApi.js
import { createAuthApi } from "../features/auth/authApi";  // from earlier
import {createRequestApi} from "../features/requests/requestApi";
import {createAnnouncementApi} from "../features/announcements/announcementsApi";

const http = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  getToken: () => localStorage.getItem("access"),
});

export const bookApi = createBookApi(http);
export const authApi = createAuthApi(http);
export const requestApi = createRequestApi(http);
export const announcementApi = createAnnouncementApi(http);
export const httpClient = http;
