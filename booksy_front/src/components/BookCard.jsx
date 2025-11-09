import {Card,CardContent,CardMedia,Typography,Box,Chip} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "../styles/BooksListPage.css";

export default function BookCard({ book, onView }) {
  const handleCardClick = () => {
    if (onView) onView(book.id);
  };

  return (
    <Card
      className="book-card"
      onClick={handleCardClick}
      sx={{ cursor: onView ? "pointer" : "default" }}
    >
      <Box className="card-image-container">
        <CardMedia
          component="img"
          height="300"
          image={
            book.photo
              ? book.photo.startsWith("http")
                ? book.photo
                : `http://localhost:8000${book.photo}`
              : "https://via.placeholder.com/300x400?text=No+Image"
          }
          alt={book.title}
          className="book-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
          }}
        />
        <Box className="availability-badge">
          {book.available ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="Available"
              size="small"
              className="badge-available"
            />
          ) : (
            <Chip
              icon={<CancelIcon />}
              label="Unavailable"
              size="small"
              className="badge-unavailable"
            />
          )}
        </Box>
      </Box>

      <CardContent className="book-content">
        <Typography variant="h6" className="book-title">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="book-author">
          by {book.author}
        </Typography>

        {book.description && (
          <Typography variant="body2" className="book-description">
            {book.description}
          </Typography>
        )}

        <Box className="book-meta">
          {book.genre && (
            <Chip label={book.genre} size="small" className="genre-chip" />
          )}
          <Chip
            icon={<AttachMoneyIcon />}
            label={`$${parseFloat(book.price_per_day).toFixed(2)}/day`}
            size="small"
            className="price-chip"
          />
        </Box>
      </CardContent>
    </Card>
  );
}