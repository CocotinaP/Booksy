// src/features/auth/authApi.js
export function createAuthApi(http) {
  return {
    // Login with your chosen identifier (email/username/employeeId/etc.)
    login({ identifier, password }) {
      return http.post("/auth/login", { body: { identifier, password } });
    },

    // Optional registration
    register({ identifier, email, password, ...extra }) {
      return http.post("/auth/register", { body: { identifier, email, password, ...extra } });
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
