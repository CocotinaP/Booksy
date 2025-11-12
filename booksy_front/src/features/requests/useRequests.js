import { useQuery } from "@tanstack/react-query";

export function useRequests(requestApi, { type }) {
  return useQuery({
    queryKey: ["requests", type],
    queryFn: async () => {
      const data = await requestApi.list({ type });
      // backendul poate trimite {"results": [...]} sau lista direct
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.results)) return data.results;
      return [];
    },
  });
}
