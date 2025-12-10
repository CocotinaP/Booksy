// src/features/userMedals/MedalBadge.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
} from "@mui/material";

export function MedalBadge({ medal }) {
  const {
    medal: medalInfo,
    progress,
    progress_percent,
    is_unlocked,
    unlocked_at,
  } = medal;

  const [open, setOpen] = useState(false);

  // percentage of the grayscale mask
  const grayPercent = 100 - progress_percent; // 50% progress = 50% grayscale mask

  return (
    <>
      {/* Badge */}
      <Paper
        elevation={4}
        onClick={() => setOpen(true)}
        sx={{
          cursor: "pointer",
          width: 130,
          height: 130,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.2s ease",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        {/* Colored Image */}
        <Box
          component="img"
          src={medalInfo.icon}
          alt={medalInfo.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {/* Grayscale Overlay */}
        <Box
          component="img"
          src={medalInfo.icon}
          alt={medalInfo.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            filter: "grayscale(1)",

            // mask the RIGHT side depending on progress
            // example: progress=50 → mask 50% right side only
            WebkitMaskImage: `linear-gradient(
              to right,
              transparent 0%,
              transparent ${progress_percent}%,
              black ${progress_percent}%,
              black 100%
            )`,
            maskImage: `linear-gradient(
              to right,
              transparent 0%,
              transparent ${progress_percent}%,
              black ${progress_percent}%,
              black 100%
            )`,
          }}
        />
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{medalInfo.name}</DialogTitle>
        <DialogContent dividers>
          <Typography>{medalInfo.description}</Typography>

          {/* big preview */}
          <Box
            component="img"
            src={medalInfo.icon}
            alt={medalInfo.name}
            sx={{ width: "100%", mt: 2, borderRadius: 2 }}
          />

          <Typography sx={{ mt: 2 }}>
            Progress: {progress}/{medalInfo.threshold} ({progress_percent}%)
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progress_percent}
            sx={{ mt: 1, height: 10, borderRadius: 5 }}
          />

          {is_unlocked && unlocked_at && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Unlocked at: {new Date(unlocked_at).toLocaleDateString()}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
