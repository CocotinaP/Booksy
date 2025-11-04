// src/features/books/useBooks.js
import { useQuery } from "@tanstack/react-query";

export function useBooks(bookApi, { page = 1, pageSize = 20, q } = {}) {
  return useQuery({
    queryKey: ["books", { page, pageSize, q }],
    queryFn: () => bookApi.list({ page, pageSize, q }),
    keepPreviousData: true,
  });
}
