// src/features/requests/useRequestMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRequestMutations(requestApi) {
  const qc = useQueryClient();

  const createRequest = useMutation({
    mutationFn: (payload) => requestApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });

  const acceptRequest = useMutation({
    mutationFn: (id) => requestApi.accept(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["request", id] });
    },
  });

  const declineRequest = useMutation({
    mutationFn: (id) => requestApi.refuse(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["request", id] });
    },
  });

  const removeRequest = useMutation({
    mutationFn: (id) => requestApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });

  return { createRequest, acceptRequest, declineRequest, removeRequest };
}
