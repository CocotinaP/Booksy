import { Box, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { UserAchievements } from "../features/medals/UserAchievements";

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      <Typography>Welcome to the protected area.</Typography>
      <Typography variant="h6">
        {user?.first_name} {user?.last_name}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        <b>Rating:</b> ⭐ {user?.rating ?? 0}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        <b>Email:</b> {user?.email}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        <b>Telefon:</b> {user?.phone_number ?? "Not provided"}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        <b>Adresă:</b> {user?.address ?? "Not provided"}
      </Typography>
      <UserAchievements></UserAchievements>
    </Box>
  );
}
