// src/api/notificationsApi.js
import { httpClient } from "./index";

export const notificationsApi = {
  getAll: () => httpClient.get("/notifications/"),

  getUnread: () => httpClient.get("/notifications/unread/"),

  markRead: (id) =>
    httpClient.put(`/notifications/${id}/mark-read/`),

  delete: (id) =>
    httpClient.del(`/notifications/${id}/`),

  create: (data) =>
    httpClient.post("/notifications/create/", { body: data }),
};
