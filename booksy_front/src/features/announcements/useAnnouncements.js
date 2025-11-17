import { useQuery } from "@tanstack/react-query";

export function useAnnouncements(announcementApi, currentUserId) {
  return useQuery({
    queryKey: ["book-announcements"],
    queryFn: async () => {
      const data = await announcementApi.list();
      const list = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];

      const myAnnouncements = list.filter(a => a.publisher === currentUserId);
      const otherAnnouncements = list.filter(a => a.publisher !== currentUserId);

      return { myAnnouncements, otherAnnouncements };
    },
  });
}