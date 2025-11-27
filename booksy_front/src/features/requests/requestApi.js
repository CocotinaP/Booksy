// src/features/requests/requestApi.js
export function createRequestApi(http) {
  return {
    list: async ({ type }) => {
      if (type === "incoming") {
        return http.get("/books-requests/received/");
      } else if (type === "outgoing") {
        return http.get("/books-requests/sent/");
      } else {
        return http.get("/books-requests/");
      }
    },
    create: (data) => http.post("/books-requests/", { body: data }),
    accept: (id) => http.put(`/books-requests/${id}/accept/`),
    reject: (id) => http.put(`/books-requests/${id}/reject/`),
    cancel: (id) => http.put(`/books-requests/${id}/cancel/`),
  };
}
