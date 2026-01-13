import { useEffect, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiClient } from "../api/apiClient";

import QuizProgress from "../components/quiz/QuizProgress";
import QuizQuestionCard from "../components/quiz/QuizQuestionCard";
import QuizResultCardSubmit from "../components/quiz/QuizResultCardSubmit";

import { fetchQuizQuestions, submitQuizAnswers } from "../api/quizApi";

export default function QuizPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.id;
  const RESULT_KEY = userId ? `quiz_last_result_uid_${userId}` : null;
  const SUMMARY_KEY = userId ? `quiz_last_summary_uid_${userId}` : null;

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchQuizQuestions();
        if (!Array.isArray(data)) throw new Error("Endpoint-ul de întrebări nu returnează o listă.");

        if (mounted) setQuestions(data);
      } catch (e) {
        if (mounted) setError(e?.message || "Eroare la încărcarea quiz-ului.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const currentQuestion = questions[currentIdx];
  const selectedOptionId = currentQuestion ? answersMap[currentQuestion.id] : null;

  const allAnswered = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q) => answersMap[q.id]);
  }, [questions, answersMap]);

  const handleSelect = (questionId, optionId) => {
    setAnswersMap((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handlePrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1));

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      setError(null);

      if (!userId || !RESULT_KEY || !SUMMARY_KEY) {
        throw new Error("User-ul nu este încă încărcat. Reîncearcă după ce ești logată.");
      }

      const answersArray = questions.map((q) => ({
        question_id: q.id,
        option_id: answersMap[q.id],
      }));

      const summary = questions.map((q) => {
        const selectedId = answersMap[q.id];
        const selectedOpt = (q.options || []).find((o) => o.id === selectedId);
        return {
          question_id: q.id,
          question_text: q.question_text ?? q.text ?? `Întrebarea #${q.id}`,
          option_id: selectedId,
          option_text: selectedOpt?.option_text ?? selectedOpt?.text ?? `Opțiunea #${selectedId}`,
        };
      });

      // salvăm summary per user
      localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));

      // 1) submit la backend
      const res = await submitQuizAnswers(answersArray);

      // 2) fallback (dacă backend nu a dat recommended_book)
      let finalResult = res;

      if (!res?.recommended_book) {
        const mappedGenre = "Science Fiction";

        const books = await apiClient.get("/books/");
        const list = Array.isArray(books) ? books : [];

        const candidates = list.filter(
          (b) => (b.genre || "").toLowerCase() === mappedGenre.toLowerCase()
        );

        if (candidates.length) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          finalResult = {
            ...res,
            matched_genre: mappedGenre,
            recommended_book: pick,
            _fallback: true,
          };
        }
      }

      // 3) IMPORTANT: salvăm finalResult (nu res) + setăm finalResult
      localStorage.setItem(RESULT_KEY, JSON.stringify(finalResult));
      setResult(finalResult);
    } catch (e) {
      setError(e?.payload?.detail || e?.message || "Eroare la trimiterea răspunsurilor.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!userId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Se încarcă user-ul...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={22} />
          <Typography>Se încarcă quiz-ul...</Typography>
        </Stack>
      </Box>
    );
  }

  if (result) {
    return (
      <Box sx={{ p: 3, pb: 10 }}>
        <Typography variant="h5" gutterBottom>
          Rezultatul quiz-ului
        </Typography>

        <QuizResultCardSubmit result={result} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate("/dashboard")}>
            Înapoi la Dashboard
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Refă quiz-ul
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: 10 }}>
      <Typography variant="h5" gutterBottom>
        Quiz: Ce carte ți se potrivește?
      </Typography>

      <QuizProgress current={currentIdx} total={questions.length} />

      <QuizQuestionCard
        question={currentQuestion}
        selectedOptionId={selectedOptionId}
        onSelect={handleSelect}
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Renunță
        </Button>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handlePrev} disabled={currentIdx === 0}>
            Înapoi
          </Button>

          {currentIdx < questions.length - 1 ? (
            <Button variant="contained" onClick={handleNext} disabled={!selectedOptionId}>
              Următoarea
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered || submitLoading}>
              {submitLoading ? "Se trimite..." : "Finalizează"}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
