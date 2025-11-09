// src/features/books/useBookMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useBookMutations(bookApi) {
  const qc = useQueryClient();

  const createBook = useMutation({
    mutationFn: (payload) => bookApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });

  const updateBook = useMutation({
    mutationFn: ({ id, payload }) => bookApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["book", id] });
    },
  });

  const rentBook = useMutation({
    mutationFn: (id) => bookApi.rent(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["book", id] });
    },
  });

  const removeBook = useMutation({
    mutationFn: (id) => bookApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });

  return { createBook, updateBook, rentBook, removeBook };
}
