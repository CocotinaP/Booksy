import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function QuizResultCard() {
  const { token } = useAuth(); // presupun că ai token în context; dacă e altfel, zi-mi cum îl ții
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      // IMPORTANT: aici trebuie endpoint-ul corect.
      // Temporar, pun 2 variante uzuale. Păstrează una după ce confirmăm ruta din urls.py.
      const candidates = ["/api/profile/", "/api/users/me/"];

      for (const url of candidates) {
        try {
          const res = await axios.get(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });

          if (!mounted) return;
          setProfile(res.data);
          setLoading(false);
          return;
        } catch (e) {
          // trecem la următorul candidat
        }
      }

      if (!mounted) return;
      setError("Nu am putut încărca rezultatul quiz-ului (verifică endpoint-ul de profil).");
      setLoading(false);
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [token]);

  if (loading) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={20} />
            <Typography>Se încarcă rezultatul quiz-ului…</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  // Ajustează cheile exact cum vin din backend:
  // exemple posibile: quiz_result_genre, quiz_recommended_book sau quizRecommendedBook etc.
  const genre =
    profile?.quiz_result_genre?.name ||
    profile?.quiz_result_genre ||
    profile?.quiz_result ||
    null;

  const book =
    profile?.quiz_recommended_book ||
    profile?.quizRecommendedBook ||
    null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rezultatul tău la Quiz
        </Typography>

        {!genre && !book ? (
          <Typography variant="body2">
            Încă nu ai completat quiz-ul sau endpoint-ul de profil nu întoarce câmpurile necesare.
          </Typography>
        ) : (
          <>
            {genre && (
              <Typography sx={{ mb: 1 }}>
                <b>Gen potrivit:</b> {genre}
              </Typography>
            )}

            {book && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ mb: 1 }}><b>Cartea recomandată:</b></Typography>
                <Typography><b>{book.title}</b></Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {book.author} • {book.genre}
                </Typography>
                {book.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {book.description}
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
