// src/features/requests/useRequests.js
import { useQuery } from "@tanstack/react-query";

export function useRequests(requestApi, { type, page = 1, pageSize = 20 } = {}) {
  return useQuery({
    queryKey: ["requests", { type, page, pageSize }],
    queryFn: () => requestApi.list({ type, page, pageSize }),
    keepPreviousData: true,
  });
}
