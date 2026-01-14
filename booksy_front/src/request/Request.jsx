// src/features/requests/Request.jsx
import { Paper, Typography, Stack, Button } from "@mui/material";

export default function Request({ request, type, onApprove, onReject }) {
  return (
    <Paper sx={{ p: 2 }}>
      {/* Titlu carte */}
      <Typography variant="subtitle1">{request.book.title}</Typography>

      {/* Info despre cerere */}
      <Typography variant="body2" color="text.secondary">
        {type === "incoming"
          ? `From: ${request.requester.username}`
          : `To: ${request.book.owner}`}
      </Typography>

      {type === "incoming" &&
        request.status === "accepted" &&
        request.requester_phone && (
          <Typography variant="body2" color="text.secondary">
            Telefon: <strong>{request.requester_phone}</strong>
          </Typography>
        )}

      <Typography variant="body2" color="text.secondary">
        Perioadă: {request.start_date} → {request.end_date}
      </Typography>

      {request.message && (
        <Typography variant="body2" color="text.secondary">
          Message: {request.message}
        </Typography>
      )}

      {/* Butoanele doar pentru cereri primite și pending */}
      {type === "incoming" && request.status === "pending" && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onApprove(request.id)}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => onReject(request.id)}
          >
            Decline
          </Button>
        </Stack>
      )}

      {/* Status pentru cereri trimise */}
      {type === "outgoing" && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Status: {request.status}
        </Typography>
      )}
    </Paper>
  );
}
