import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { bookApi } from "../api";
import "../styles/AddBookPage.css";

const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Thriller",
  "Non-fiction",
  "Historical",
  "Young Adult",
];

export default function AddBookPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [available, setAvailable] = useState(true);
  const [photo, setPhoto] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("genre", genre);
      formData.append("description", description);
      formData.append("price_per_day", pricePerDay || 0);
      formData.append("available", available ? "true" : "false");
      if (photo) {
        formData.append("photo", photo);
      }

      await bookApi.create(formData);   // ai nevoie de metoda create în bookApi

      // după creare, te întorci la lista de cărți
      navigate("/listbooks");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/listbooks");
  };

  return (
    <Box className="add-book-page">
      <Paper elevation={4} className="add-book-paper">
        <Typography variant="h5" className="add-book-title">
          Add New Book
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="add-book-form">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
            required
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              label="Genre"
              onChange={(e) => setGenre(e.target.value)}
              required
            >
              {GENRES.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            minRows={4}
          />

          <TextField
            label="Price per day"
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, step: 1 }}
          />

          {/* Photo upload */}
          <Box className="file-input-wrapper">
            <Button variant="outlined" component="label">
              Choose Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="body2" sx={{ ml: 2 }}>
              {photo ? photo.name : "No file selected"}
            </Typography>
          </Box>

          {/* Available checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
            }
            label="Available"
            sx={{ mt: 1 }}
          />

          <Box className="form-actions">
            <Button onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
            >
              {submitting ? (
                <CircularProgress size={24} />
              ) : (
                "Save Book"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
