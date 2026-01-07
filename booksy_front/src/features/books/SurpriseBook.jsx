import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import BookCard from "../../components/BookCard"; // componenta deja existenta

export default function SurpriseBook() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const token = localStorage.getItem("access") || localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchOptions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/options/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setGenres(data.genres);
      } catch (err) {
        console.error("Eroare la preluarea genurilor:", err);
      }
    };

    fetchOptions();
  }, [token]);

  // --- Handle Surpriză ---
  const handleSurprise = async () => {
    if (!token) {
      setError("Trebuie să fii autentificat.");
      return;
    }

    if (!genre) {
      setError("Alege un gen pentru surpriză.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://127.0.0.1:8000/api/books/surprise/?genre=${genre}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || errData.error || "Nicio surpriză 😢");
      }

      const data = await response.json();
      setBook(data);
    } catch (err) {
      console.error("Eroare la surpriză:", err);
      setError(err.message);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
        Surpriza pentru tine🎁
      </Typography>
      {/* --- Select Gen Dinamic --- */}
      <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
        <InputLabel>Gen</InputLabel>
        <Select
          value={genre}
          label="Gen"
          onChange={(e) => setGenre(e.target.value)}
        >
          <MenuItem value="">Toate genurile</MenuItem>
          {genres.map((g) => (
            <MenuItem key={g.id} value={g.name}>
              {g.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* --- Buton Surpriză --- */}
      <Button
        variant="contained"
        startIcon={<CardGiftcardIcon />}
        onClick={handleSurprise}
        disabled={loading}
      >
        Surpriza
      </Button>

      {/* --- Loader --- */}
      {loading && <CircularProgress sx={{ ml: 2 }} size={24} />}

      {/* --- Eroare --- */}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* --- Card cu BookCard --- */}
      {book && (
        <Box sx={{ mt: 3, maxWidth: 300 }}>
          <BookCard book={book} />
        </Box>
      )}
    </Box>
  );
}
