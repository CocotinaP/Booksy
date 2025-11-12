import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InfoIcon from "@mui/icons-material/Info";
import { useBook } from "../features/books/useBook";
import { bookApi, requestApi } from "../api";
import { useRequestMutations } from "../features/requests/useRequestMutations";

export default function BookViewPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading, isFetching, error } = useBook(bookApi, bookId);
  const { createRequest } = useRequestMutations(requestApi);

  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    message: "",
  });
  const [formError, setFormError] = useState("");

  const availabilityBadge = useMemo(() => {
    if (!book) return null;
    return book.available ? (
      <Chip
        icon={<CheckCircleIcon />}
        color="success"
        label="Disponibilă"
        size="small"
      />
    ) : (
      <Chip
        icon={<CancelIcon />}
        color="error"
        label="Indisponibilă"
        size="small"
      />
    );
  }, [book]);

  const handleClose = () => {
    navigate("/listbooks", { replace: true });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.start_date || !form.end_date) {
      setFormError("Completează datele de început și sfârșit.");
      return;
    }

    try {
      await createRequest.mutateAsync({
        book: bookId,
        start_date: form.start_date,
        end_date: form.end_date,
        message: form.message,
      });
      alert("Cererea de închiriere a fost trimisă!");
      setOpenForm(false);
    } catch (err) {
      console.error("Eroare la trimiterea cererii:", err);
      setFormError(err.message || "Nu s-a putut trimite cererea.");
    }
  };

  if (!bookId) {
    handleClose();
    return null;
  }

  return (
    <Dialog open onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {book?.title || "Detalii carte"}
        {book && (
          <Box component="span" sx={{ ml: 2 }}>
            {availabilityBadge}
          </Box>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: 280 }}>
        {isLoading || isFetching ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Se încarcă detaliile cărții...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">
            {error.message || "Nu s-au putut încărca detaliile cărții."}
          </Alert>
        ) : book ? (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box
              component="img"
              src={
                book.photo
                  ? book.photo.startsWith("http")
                    ? book.photo
                    : `http://localhost:8000${book.photo}`
                  : "https://via.placeholder.com/300x400?text=No+Image"
              }
              alt={book.title}
              sx={{
                width: { xs: "100%", md: 260 },
                height: { xs: 340, md: 360 },
                objectFit: "cover",
                borderRadius: 1,
                boxShadow: (theme) => theme.shadows[3],
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x400?text=No+Image";
              }}
            />
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h5">{book.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body1">{book.author}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CategoryIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {book.genre || "Gen necunoscut"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AttachMoneyIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {book.price_per_day
                      ? `${parseFloat(book.price_per_day).toFixed(2)} / zi`
                      : "Fără preț"}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <InfoIcon fontSize="small" color="action" sx={{ mt: 0.4 }} />
                <Typography variant="body2" color="text.secondary">
                  {book.description ||
                    "Nu există o descriere disponibilă pentru această carte."}
                </Typography>
              </Box>
              {book.publisher && (
                <Typography variant="body2" color="text.secondary">
                  Editura: {book.publisher}
                </Typography>
              )}
              {book.published_at && (
                <Typography variant="body2" color="text.secondary">
                  Publicată în: {book.published_at}
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Selectează o carte pentru a vedea detaliile.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Închide</Button>
        <Button
          variant="contained"
          onClick={() => setOpenForm(true)}
          disabled={!book?.available}
        >
          Inchiriere
        </Button>
      </DialogActions>

      {/* Formular de cerere de închiriere */}
      {openForm && (
        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Cerere de închiriere</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent dividers>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Data început"
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Data sfârșit"
                  name="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Mesaj (opțional)"
                  name="message"
                  multiline
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenForm(false)}>Anulează</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!!createRequest?.isLoading}
                >
                  {createRequest?.isLoading ? "Se trimite..." : "Trimite cererea"}
                </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </Dialog>
  );
}
