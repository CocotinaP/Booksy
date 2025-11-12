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

export default function RequestsPage() {
  const [tab, setTab] = useState("incoming");
  const { acceptRequest, declineRequest } = useRequestMutations(requestApi);

  // Fetch cereri (în funcție de tab)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["requests", tab],
    queryFn: async () => {
      const res = await requestApi.list({ type: tab });
      // backendul poate returna o listă simplă sau un obiect cu results
      if (Array.isArray(res)) return res;
      if (Array.isArray(res.results)) return res.results;
      return [];
    },
  });

  const handleApprove = async (id) => {
    try {
      await acceptRequest.mutateAsync(id);
      alert("Cererea a fost acceptată!");
      refetch(); // actualizează lista
    } catch (err) {
      console.error(err);
      alert("Eroare la acceptarea cererii.");
    }
  };

  const handleReject = async (id) => {
    try {
      await declineRequest.mutateAsync(id);
      alert("Cererea a fost refuzată!");
      refetch(); // actualizează lista
    } catch (err) {
      console.error(err);
      alert("Eroare la refuzul cererii.");
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
          {data.map((req) => (
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
                {req.book?.title || req.book || "Carte necunoscută"}
              </Typography>

              {tab === "incoming" ? (
                <Typography variant="body2" color="text.secondary">
                  De la:{" "}
                  {req.requester?.username || req.requester || "Necunoscut"}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Status:{" "}
                  <strong
                    style={{
                      color:
                        req.status === "accepted"
                          ? "green"
                          : req.status === "rejected"
                          ? "red"
                          : "gray",
                    }}
                  >
                    {req.status}
                  </strong>
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

              {/* butoane accept/refuz */}
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
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nu există cereri {tab === "incoming" ? "primite" : "trimise"}.
        </Typography>
      )}
    </Box>
  );
}
