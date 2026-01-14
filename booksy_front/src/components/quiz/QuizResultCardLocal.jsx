import { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function QuizResultCardLocal() {
  const { user } = useAuth();
  const userId = user?.id;

  const { result, summary } = useMemo(() => {
    if (!userId) return { result: null, summary: null };

    const r = localStorage.getItem(`quiz_last_result_uid_${userId}`);
    const s = localStorage.getItem(`quiz_last_summary_uid_${userId}`);

    return {
      result: r ? JSON.parse(r) : null,
      summary: s ? JSON.parse(s) : null,
    };
  }, [userId]);

  const detailMsg = result?.detail ?? null;
  const matchedGenre = result?.matched_genre ?? null;
  const recommended = result?.recommended_book ?? null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h6">Rezultatul tău la Quiz</Typography>
          </Box>

          <Button component={RouterLink} to="/quiz" variant="contained">
            {result ? "Refă quiz-ul" : "Începe quiz-ul"}
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {!result && !Array.isArray(summary) ? (
          <Typography variant="body2">
            Încă nu ai completat quiz-ul pe acest cont.
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}></Typography>

            {detailMsg && !result?._fallback && (
              <Typography variant="body2">{detailMsg}</Typography>
            )}

            {result?._fallback && (
              <Typography variant="body2" sx={{ opacity: 0.85 }}></Typography>
            )}

            {!detailMsg && matchedGenre && (
              <Typography variant="body2">
                <b>Gen potrivit:</b> {matchedGenre}
              </Typography>
            )}

            {recommended && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Cartea recomandată:</Typography>
                <Typography>
                  <b>{recommended.title ?? "—"}</b>
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {recommended.author ? `Autor: ${recommended.author}` : ""}
                  {recommended.author && recommended.genre ? " • " : ""}
                  {recommended.genre ? `Gen: ${recommended.genre}` : ""}
                </Typography>

                {result?._fallback && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 1, opacity: 0.7 }}
                  ></Typography>
                )}
              </Box>
            )}

            {Array.isArray(summary) && summary.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Răspunsurile tale:
                </Typography>

                {summary.map((s) => (
                  <Box key={s.question_id} sx={{ mb: 1.2 }}>
                    <Typography variant="body2">
                      <b>{s.question_text}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                      Ai ales: {s.option_text}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
