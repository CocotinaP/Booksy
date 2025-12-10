// src/features/userMedals/useUserMedals.js
import { useQuery } from "@tanstack/react-query";

export function useUserMedals(userMedalApi) {
  return useQuery({
    queryKey: ["userMedals"],
    queryFn: () => userMedalApi.list(),
    keepPreviousData: true,
  });
}
