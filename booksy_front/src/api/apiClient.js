import { createHttpClient } from "./httpClient";

export const apiClient = createHttpClient({
  baseURL: "http://127.0.0.1:8000/api",
  getToken: () => localStorage.getItem("access"),
});
