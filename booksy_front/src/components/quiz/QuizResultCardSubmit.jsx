import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Divider, Box, CircularProgress } from "@mui/material";
import { normalizeGenreName } from "./genreMap";
import { apiClient } from "../../api/apiClient"; // ajustează path dacă e altul

export default function QuizResultCardSubmit({ result }) {
  const [fallbackBook, setFallbackBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const detail = result?.detail ?? null;
  const matchedGenre = result?.matched_genre ?? null;
  const recommended = result?.recommended_book ?? null;

  useEffect(() => {
    let mounted = true;

    // dacă backend a returnat deja carte, nu facem nimic
    if (recommended) return;

    // dacă nu avem gen, nu putem face fallback
    const genreRaw =
      matchedGenre ||
      (typeof detail === "string" && detail.includes(":")
        ? detail.split(":")[1]?.split(",")[0]?.trim()
        : null);

    if (!genreRaw) return;

    const genre = normalizeGenreName(genreRaw);

    (async () => {
      try {
        setLoading(true);

        // presupunem că /books/ îți dă lista; filtrăm în FE după genre
        const books = await apiClient.get("/books/");

        const list = Array.isArray(books) ? books : [];
        const candidates = list.filter((b) => (b.genre || "").toLowerCase() === genre.toLowerCase());

        if (!candidates.length) return;

        // alegem prima (sau random)
        const pick = candidates[Math.floor(Math.random() * candidates.length)];

        if (mounted) setFallbackBook(pick);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [detail, matchedGenre, recommended]);

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Rezultatul tău la Quiz</Typography>
        <Divider sx={{ my: 2 }} />

        {recommended ? (
          <>
            <Typography sx={{ mb: 1 }}>
              <b>Gen potrivit:</b> {matchedGenre}
            </Typography>
            <Typography><b>{recommended.title}</b></Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {recommended.author ? `Autor: ${recommended.author}` : ""}
            </Typography>
          </>
        ) : (
          <>
            {detail && <Typography sx={{ mb: 1 }}>{detail}</Typography>}

            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <CircularProgress size={18} />
                <Typography variant="body2">Caut o recomandare alternativă…</Typography>
              </Box>
            )}

            {fallbackBook && (
              <Box sx={{ mt: 2 }}>
                <Typography><b>{fallbackBook.title}</b></Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {fallbackBook.author ? `Autor: ${fallbackBook.author}` : ""}
                  {fallbackBook.author && fallbackBook.genre ? " • " : ""}
                  {fallbackBook.genre ? `Gen: ${fallbackBook.genre}` : ""}
                </Typography>
              </Box>
            )}

            {!loading && !fallbackBook && (
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Nu am găsit nici în fallback o carte disponibilă în acest gen.
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
