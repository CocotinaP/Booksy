
export function createAnnouncementResponseApi(http) {
  return {
    create: async (formData) => {
      return http.post("/book-announcements-responses/", { body: formData });
    },
  };
}