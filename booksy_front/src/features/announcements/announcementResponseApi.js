
export function createAnnouncementResponseApi(http) {
  return {
    create: async (formData) => {
      return http.post("/book-announcements-responses/", { body: formData });
    },
    listForAnnouncement: async (announcementId) => {
      return http.get(`/book-announcements-responses/announcement/${announcementId}/`);
    },
    accept: async (responseId) => {
      return http.post(`/book-announcements-responses/${responseId}/accept/`);
    },
    reject: async (responseId) => {
      return http.post(`/book-announcements-responses/${responseId}/reject/`);
    },
  };
}