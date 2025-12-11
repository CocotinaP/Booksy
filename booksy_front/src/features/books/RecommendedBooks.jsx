import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import BookCard from "../../components/BookCard";

export default function RecommendedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      // 1. Luăm token-ul (Exact ca în varianta care merge)
      const token = localStorage.getItem("access") || localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // 2. Cerem TOATE cărțile de la server
        const response = await fetch("http://127.0.0.1:8000/api/books/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
           throw new Error(`Eroare server: ${response.status}`);
        }

        const data = await response.json();

        // 3. Extragem lista (suportă și paginare, și listă simplă)
        let allBooks = [];
        if (Array.isArray(data)) {
            allBooks = data;
        } else if (data.results && Array.isArray(data.results)) {
            allBooks = data.results;
        }

        // 4. AMESTECĂM și luăm 10 CĂRȚI (pentru efectul de bandă)
        const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10); 
        
        setBooks(selected);

      } catch (err) {
        console.error("Eroare la recomandări:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (error) return null; // Dacă e eroare, ascundem secțiunea discret
  if (books.length === 0) return null;

  return (
    <Box sx={{ mt: 6, mb: 4, overflow: "hidden" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
        Recomandate pentru tine 📚
      </Typography>

      {/* --- STILURI CSS PENTRU ANIMAȚIE --- */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } 
          }
          
          /* Când pui mouse-ul, banda se oprește ca să poți citi/da click */
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* --- CONTAINERUL MARQUEE --- */}
      <Box 
        className="marquee-container" 
        sx={{ 
            width: '100%', 
            overflow: 'hidden',
            position: 'relative'
        }}
      >
          <Box 
            className="marquee-track"
            sx={{
              display: 'flex',
              gap: 3, // Distanța dintre cărți
              width: 'max-content', 
              // Viteza: 40s (poți pune 60s dacă vrei mai lent)
              animation: 'scroll 40s linear infinite', 
              py: 2,
              px: 1
            }}
          >
              {/* --- SERIA 1 --- */}
              {books.map((book, index) => (
                  <Box key={`orig-${book.id}-${index}`} sx={{ minWidth: '280px', maxWidth: '300px' }}>
                      <BookCard book={book} />
                  </Box>
              ))}

              {/* --- SERIA 2 (DUPLICAT PENTRU EFECT INFINIT) --- */}
              {books.map((book, index) => (
                  <Box key={`dup-${book.id}-${index}`} sx={{ minWidth: '280px', maxWidth: '300px' }}>
                      <BookCard book={book} />
                  </Box>
              ))}
          </Box>
      </Box>
    </Box>
  );
}