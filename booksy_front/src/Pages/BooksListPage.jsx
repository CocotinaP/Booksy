import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {Grid,TextField,Box,InputAdornment,Button,CircularProgress,FormControl,InputLabel,Select,MenuItem,Alert,Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useBooks } from "../features/books/useBooks";
import { bookApi } from "../api/index";
import BookCard from "../components/BookCard";
import "../styles/BooksListPage.css";

export default function BooksListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const { data, isLoading, error } = useBooks(bookApi, {
    page,
    pageSize,
    q: searchQuery,
    genre: filterGenre !== "all" ? filterGenre : undefined,
    available: filterAvailability !== "all" ? filterAvailability === "available" : undefined,
  });

  const books = data?.items ?? data ?? [];
  const availableGenres = [...new Set(books.map((book) => book.genre).filter(Boolean))];

  const total = data?.total ?? books.length;

  const handleAddBook = () => {
    navigate("/add-book");     
  };

  const handleView = (id) => {
    if (!id) return;
    navigate(`${id}`);
  };

  if (isLoading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading books...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-container">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "Failed to load books"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="books-list-container">
      <Box className="books-header">
        <Typography variant="h4" className="page-title">
          Book Collection
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="add-book-button"
          onClick={handleAddBook}
        >
          Add New Book
        </Button>
      </Box>

      <Box className="filters-container">
        <TextField
          fullWidth
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="search-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl className="filter-select">
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterGenre}
            label="Genre"
            onChange={(e) => {
              setFilterGenre(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All Genres</MenuItem>
            {availableGenres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="filter-select">
          <InputLabel>Availability</InputLabel>
          <Select
            value={filterAvailability}
            label="Availability"
            onChange={(e) => {
              setFilterAvailability(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All Books</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body2" className="results-count">
        Showing {books.length} of {total} books
      </Typography>

      {books.length === 0 ? (
        <Box className="empty-state">
          <Typography variant="h6" color="text.secondary">
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery || filterGenre !== "all" || filterAvailability !== "all"
              ? "Try adjusting your filters or search query"
              : "Start by adding your first book"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} className="books-grid">
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={book.id}>
              <BookCard
                book={book}
                onView={handleView}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <Outlet />
    </Box>
  );
}