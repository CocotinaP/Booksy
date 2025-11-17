// src/features/announcements/useAnnouncementMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAnnouncementMutations(announcementApi) {
  const qc = useQueryClient();

  const createAnnouncement = useMutation({
    mutationFn: (payload) => announcementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["book-announcements"] }),
  });

  const removeAnnouncement = useMutation({
    mutationFn: (id) => announcementApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["book-announcements"] }),
  });

  const updateAnnouncement = useMutation({
    mutationFn: ({ id, payload }) => announcementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["book-announcements"] });
      qc.invalidateQueries({ queryKey: ["book-announcement", id] });
    },
  });

  return { createAnnouncement, removeAnnouncement, updateAnnouncement };
}