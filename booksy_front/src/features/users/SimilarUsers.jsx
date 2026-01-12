import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

export default function SimilarUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access") || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Trebuie să fii autentificat pentru a vedea utilizatori similari.");
      setLoading(false);
      return;
    }

    const fetchSimilarUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/recommendations/similarity/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Dacă răspunsul nu e ok
        if (!response.ok) {
          const text = await response.text(); // citește textul primit
          try {
            const errData = JSON.parse(text); // încearcă să parsezi JSON
            throw new Error(
              errData.message || errData.error || "Nu am putut încărca utilizatorii similari."
            );
          } catch {
            throw new Error("Serverul nu a returnat JSON. Probabil token invalid sau 401.");
          }
        }

        // Răspuns OK
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = []; // fallback dacă serverul a trimis HTML
        }

        setUsers(data);
      } catch (err) {
        console.error("Eroare la încărcarea utilizatorilor similari:", err);
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarUsers();
  }, [token]);

  // Loader
  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Eroare
  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  // Empty state (user nou / ADN gol)
  if (!users || users.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Descoperă cititori cu gusturi similare 📚
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completează quiz-ul literar sau citește mai multe cărți pentru a vedea
          persoane compatibile cu tine.
        </Typography>
      </Box>
    );
  }

  // Lista cu useri similari
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Cititori cu gusturi similare
      </Typography>

      <List>
        {users.map((user, index) => (
          <Box key={user.username}>
            <ListItem>
              <ListItemText
                primary={`${user.first_name || user.username}`}
                secondary={`Compatibilitate: ${user.compatibility_score}`}
              />
            </ListItem>
            {index < users.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  );
}
