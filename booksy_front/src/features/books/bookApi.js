// src/features/books/bookApi.js
export function createBookApi(http) {
  return {
    list({ page = 1, pageSize = 20, q, genre, available } = {}) {
      const params = { 
        page, 
        pageSize, 
        ...(q ? { q } : {}),
        ...(genre ? { genre } : {}),
        ...(available !== undefined ? { available: available.toString() } : {})
      };
      return http.get("/books", { params });
    },
    get(id) {
      return http.get(`/books/${encodeURIComponent(id)}`);
    },
    create(payload) {
      return http.post("/books", { body: payload });
    },
    update(id, payload) {
      return http.put(`/books/${encodeURIComponent(id)}`, { body: payload });
    },
    remove(id) {
      return http.del(`/books/${encodeURIComponent(id)}`);
    },
    rent(id) {
      return http.post(`/books/${encodeURIComponent(id)}/rent`);
    },
  };
}