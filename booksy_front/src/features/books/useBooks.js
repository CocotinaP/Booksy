// src/features/books/useBooks.js
import { useQuery } from "@tanstack/react-query";

export function useBooks(bookApi, params = {}) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => bookApi.list(params),
    keepPreviousData: true,
  });
}
