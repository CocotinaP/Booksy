import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { requestApi } from "../api";
import { useRequestMutations } from "../features/requests/useRequestMutations";

function canCancelRequest(req) {
  if (!req.start_date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(req.start_date);
  start.setHours(0, 0, 0, 0);

  const diffMs = start - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 3;
}

export default function RequestsPage() {
  const [tab, setTab] = useState("incoming");
  const { acceptRequest, declineRequest, cancelRequest } =
    useRequestMutations(requestApi);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["requests", tab],
    queryFn: async () => {
      const res = await requestApi.list({ type: tab });
      if (Array.isArray(res)) return res;
      if (Array.isArray(res.results)) return res.results;
      return [];
    },
  });

  const handleApprove = async (id) => {
    try {
      await acceptRequest.mutateAsync(id);
      alert("Cererea a fost acceptată!");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Eroare la acceptarea cererii.");
    }
  };

  const handleReject = async (id) => {
    try {
      await declineRequest.mutateAsync(id);
      alert("Cererea a fost refuzată!");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Eroare la refuzul cererii.");
    }
  };

  const handleCancel = async (req) => {
    if (!window.confirm("Ești sigur că vrei să anulezi această cerere?")) return;

    try {
      await cancelRequest.mutateAsync(req.id); // backend-ul face logica de penalizare etc.
      alert("Cererea a fost anulată.");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Eroare la anularea cererii.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cereri de închiriere
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Cereri primite" value="incoming" />
        <Tab label="Cereri trimise" value="outgoing" />
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">
          {error.message || "Eroare la încărcarea cererilor."}
        </Alert>
      ) : data && data.length > 0 ? (
        <Stack spacing={2}>
          {data.map((req) => {
            const isOutgoing = tab === "outgoing";

            const showCancelButton =
              isOutgoing &&
              ["pending", "accepted"].includes(req.status) &&
              canCancelRequest(req);

            return (
              <Paper
                key={req.id}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  borderLeft: "5px solid",
                  borderColor:
                    req.status === "accepted"
                      ? "success.main"
                      : req.status === "rejected"
                      ? "error.main"
                      : "grey.400",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {req.book_title || "Carte necunoscută"}
                </Typography>

                {tab === "incoming" ? (
                  <Typography variant="body2" color="text.secondary">
                    De la:{" "}
                    {typeof req.requester === "string"
                      ? req.requester
                      : req.requester?.username || "Necunoscut"}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Status: <strong>{req.status}</strong>
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  Perioadă: {req.start_date} → {req.end_date}
                </Typography>

                {req.message && (
                  <Typography variant="body2" color="text.secondary">
                    Mesaj: {req.message}
                  </Typography>
                )}

                {/* butoane accept/refuz – doar cereri primite */}
                {req.status === "pending" && tab === "incoming" && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprove(req.id)}
                      disabled={acceptRequest.isLoading}
                    >
                      Acceptă
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleReject(req.id)}
                      disabled={declineRequest.isLoading}
                    >
                      Refuză
                    </Button>
                  </Stack>
                )}

                {/* buton ANULEAZĂ – doar pentru cereri TRIMISE */}
                {isOutgoing && (
                  <Box sx={{ mt: 1 }}>
                    {showCancelButton ? (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleCancel(req)}
                        disabled={cancelRequest?.isLoading}
                      >
                        Anulează cererea
                      </Button>
                    ) : (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        Cererea nu mai poate fi anulată (poți anula doar cu
                        minim 3 zile înainte de începutul perioadei sau
                        statusul actual nu permite anularea).
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nu există cereri {tab === "incoming" ? "primite" : "trimise"}.
        </Typography>
      )}
    </Box>
  );
}
