import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Box,Typography,Chip,CircularProgress,Alert,Divider,} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InfoIcon from "@mui/icons-material/Info";
import { useBook } from "../features/books/useBook";
import { useBookMutations } from "../features/books/UseBookMutations";
import { bookApi } from "../api";

export default function BookViewPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading, isFetching, error } = useBook(bookApi, bookId);
  const { rentBook } = useBookMutations(bookApi);

  const availabilityBadge = useMemo(() => {
    if (!book) return null;
    return book.available ? (
      <Chip
        icon={<CheckCircleIcon />}
        color="success"
        label="Disponibila"
        size="small"
      />
    ) : (
      <Chip
        icon={<CancelIcon />}
        color="error"
        label="Indisponibila"
        size="small"
      />
    );
  }, [book]);

  const handleClose = () => {
    navigate("/listbooks", { replace: true });
  };

  const handleRent = async () => {
    if (!bookId) return;
    try {
      await rentBook.mutateAsync(bookId);
      alert("Cartea a fost închiriată cu succes!");
      handleClose();
    } catch (err) {
      console.error("Rent book failed:", err);
      alert("Nu s-a putut închiria cartea. Încearcă din nou.");
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
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
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
                e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
              }}
            />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
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
                  {book.description || "Nu există o descriere disponibilă pentru această carte."}
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
          onClick={handleRent}
          disabled={!book?.available || rentBook.isLoading}
        >
          {rentBook.isLoading ? "Se procesează..." : "Închiriază"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
