import { Box, LinearProgress, Typography } from "@mui/material";

export default function QuizProgress({ current, total }) {
  const value = total ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Întrebarea {total ? current + 1 : 0} / {total}
      </Typography>
      <LinearProgress variant="determinate" value={value} sx={{ mt: 1 }} />
    </Box>
  );
}
