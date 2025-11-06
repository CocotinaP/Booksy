// src/features/auth/authApi.js
export function createAuthApi(http) {
  return {
    // Login with your chosen identifier (email/username/employeeId/etc.)
    login({ username, password }) {
        console.log({username, password})
      return http.post("/auth/login/", { body: { username, password } });
    },

    // Optional registration
    register({ username, password, first_name, last_name, email, phone_number, address }) {
  return http.post("/auth/register/", {
    body: {
      username,
      password,
      first_name,
      last_name,
      email,
      phone_number,
      address,
    },
  });
},


    // Get the current user profile (requires auth)
    me() {
      return http.get("/auth/me");
    },

    // Refresh token (if your backend supports it)
    refresh() {
      return http.post("/auth/refresh");
    },

    // Logout / invalidate token or session
    logout() {
      return http.post("/auth/logout");
    },

    // Password reset (request + complete)
    requestPasswordReset(email) {
      return http.post("/auth/password/forgot", { body: { email } });
    },
    resetPassword({ token, password }) {
      return http.post("/auth/password/reset", { body: { token, password } });
    },

    // Change password while authenticated
    changePassword({ currentPassword, newPassword }) {
      return http.post("/auth/password/change", {
        body: { currentPassword, newPassword },
      });
    },
  };
}
