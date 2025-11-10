// src/features/requests/requestApi.js
export function createRequestApi(http) {
  return {
    list({ type, page = 1, pageSize = 20 } = {}) {
      const params = { page, pageSize, ...(type ? { type } : {}) };
      return http.get("/requests", { params });
    },
    get(id) {
      return http.get(`/requests/${encodeURIComponent(id)}`);
    },
    create(payload) {
      return http.post("/requests", { body: payload });
    },
    accept(id) {
      return http.post(`/requests/${encodeURIComponent(id)}/accept`);
    },
    refuse(id) {
      return http.post(`/requests/${encodeURIComponent(id)}/refuse`);
    },
    remove(id) {
      return http.del(`/requests/${encodeURIComponent(id)}`);
    },
  };
}
