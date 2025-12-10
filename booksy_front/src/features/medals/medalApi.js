// src/features/userMedals/userMedalApi.js
export function createUserMedalApi(http) {
  return {
    // GET /user-medals/
    list() {
      return http.get("/user-medals/");
    },

    // GET /user-medals/:id/
    get(id) {
      return http.get(`/user-medals/${encodeURIComponent(id)}/`);
    },
  };
}
