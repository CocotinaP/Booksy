import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { httpClient } from "../api";
import { createAnnouncementResponseApi } from "../features/announcements/announcementResponseApi";
import { announcementApi } from "../api";

const responseApi = createAnnouncementResponseApi(httpClient);

export default function AnnouncementResponsesPage() {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [phoneInput, setPhoneInput] = useState("");


  const { data: announcement, isLoading: isLoadingAnnouncement } = useQuery({
    queryKey: ["announcement", announcementId],
    queryFn: async () => {
      const announcements = await announcementApi.list();
      const list = Array.isArray(announcements) ? announcements : [];
      return list.find((a) => a.id === parseInt(announcementId));
    },
    enabled: !!announcementId,
  });

  const { data: responses, isLoading, error, refetch } = useQuery({
    queryKey: ["announcement-responses", announcementId],
    queryFn: async () => {
      const data = await responseApi.listForAnnouncement(announcementId);
      const allResponses = Array.isArray(data) ? data : data?.results || data?.items || [];
      // Filtrează răspunsurile respinse - nu le afișăm
      return allResponses.filter((response) => response.status !== "rejected");
    },
    enabled: !!announcementId,
  });

  const acceptMutation = useMutation({
    mutationFn: (responseId) => responseApi.accept(responseId),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcement-responses", announcementId]);
      refetch();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (responseId) => responseApi.reject(responseId),
    onSuccess: () => {
      // După respingere, actualizează cache-ul pentru a elimina răspunsul din listă
      queryClient.setQueryData(["announcement-responses", announcementId], (oldData) => {
        const allResponses = Array.isArray(oldData) ? oldData : oldData?.results || oldData?.items || [];
        // Filtrează răspunsul respins din listă
        return allResponses.filter((response) => response.status !== "rejected");
      });
      refetch();
    },
  });

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: {
        icon: <PendingIcon fontSize="small" />,
        color: "warning",
        label: "În așteptare",
      },
      accepted: {
        icon: <CheckCircleIcon fontSize="small" />,
        color: "success",
        label: "Acceptat",
      },
      rejected: {
        icon: <CancelIcon fontSize="small" />,
        color: "error",
        label: "Respins",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  const handleAccept = async (responseId) => {
    if (!confirm("Sigur vrei să accepți acest răspuns? Celelalte răspunsuri vor fi respinse automat.")) {
      return;
    }
    try {
      await acceptMutation.mutateAsync(responseId);
    } catch (err) {
      alert("Eroare la acceptarea răspunsului: " + (err.message || "Eroare necunoscută"));
    }
  };

  const handleReject = async (responseId) => {
    if (!confirm("Sigur vrei să respingi acest răspuns?")) {
      return;
    }
    try {
      await rejectMutation.mutateAsync(responseId);
    } catch (err) {
      alert("Eroare la respingerea răspunsului: " + (err.message || "Eroare necunoscută"));
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  if (isLoadingAnnouncement || isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Se încarcă răspunsurile...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "Eroare la încărcarea răspunsurilor."}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/book-announcements")}>
          Înapoi la anunțuri
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/book-announcements")}
          variant="outlined"
        >
          Înapoi
        </Button>
        <Typography variant="h4" component="h1">
          Răspunsuri pentru anunț
        </Typography>
      </Stack>

      {announcement && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
          <Typography variant="h6" gutterBottom>
            {announcement.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Autor: {announcement.author}
          </Typography>
          {announcement.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {announcement.description}
            </Typography>
          )}
        </Paper>
      )}

      {!responses || responses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nu există răspunsuri pentru acest anunț
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Utilizatorii care doresc să îți împrumute cartea vor trimite răspunsuri aici.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {responses.map((response) => (
            <Card key={response.id} elevation={2}>
              <CardContent>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  {response.image && (
                    <CardMedia
                      component="img"
                      image={getImageUrl(response.image)}
                      alt="Imagine carte"
                      sx={{
                        width: { xs: "100%", md: 200 },
                        height: { xs: 250, md: 200 },
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 2 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {response.responder_name?.[0]?.toUpperCase() ||
                            response.responder?.[0]?.toUpperCase() ||
                            "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {response.responder_name ||
                              response.responder_username ||
                              `Utilizator #${response.responder}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(response.created_at).toLocaleString("ro-RO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                          {response.responder_phone && (
                              <Typography variant="body2" color="text.secondary">
                                Telefon: <strong>{response.responder_phone}</strong>
                              </Typography>
                            )}

                        </Box>
                      </Stack>
                      {getStatusChip(response.status)}
                    </Stack>

                    {response.message && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {response.message}
                        </Typography>
                      </>
                    )}

                    {response.status === "pending" && (
                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleAccept(response.id)}
                          disabled={
                            acceptMutation.isLoading || rejectMutation.isLoading
                          }
                        >
                          Acceptă
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleReject(response.id)}
                          disabled={
                            acceptMutation.isLoading || rejectMutation.isLoading
                          }
                        >
                          Respinge
                        </Button>
                      </Stack>
                    )}

                    {(response.status === "accepted" || response.status === "rejected") && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          Acest răspuns a fost {response.status === "accepted" ? "acceptat" : "respins"}.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

