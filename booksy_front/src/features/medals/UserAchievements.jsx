// src/features/userMedals/UserAchievements.jsx
import React from "react";
import { Grid, Typography } from "@mui/material";
import { useUserMedals } from "./useUserMedals";
import { createUserMedalApi } from "./medalApi";
import { MedalBadge } from "./MedalBadge";
import { httpClient } from "../../api";

const userMedalApi = createUserMedalApi(httpClient);

export function UserAchievements() {
  const { data, isLoading, error } = useUserMedals(userMedalApi);

  if (isLoading) return <Typography>Loading achievements…</Typography>;
  if (error) return <Typography>Error loading medals.</Typography>;

  const medals = data.results ?? data; // depending on your backend pagination

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your Achievements
      </Typography>

      <Grid container spacing={3}>
        {medals.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <MedalBadge medal={m} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
