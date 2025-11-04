// src/features/books/useBook.js
import { useQuery } from "@tanstack/react-query";

export function useBook(bookApi, id) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => bookApi.get(id),
    enabled: !!id,
  });
}
