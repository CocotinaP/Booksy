// src/features/userMedals/useUserMedal.js
import { useQuery } from "@tanstack/react-query";

export function useUserMedal(userMedalApi, id) {
  return useQuery({
    queryKey: ["userMedal", id],
    queryFn: () => userMedalApi.get(id),
    enabled: !!id,
  });
}
