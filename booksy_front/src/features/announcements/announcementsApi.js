export function createAnnouncementApi(http) {
  return {
    list: async () => {
      return http.get("/book-announcements/");
    },

    create: async (data) => {
      const response = await http.post("/book-announcements/", { body: data });
      return response.data;
    },

    delete: async (id) => {
      const response = await http.del(`/book-announcements/${id}/`);
      return response.data;
    }
  };
}
