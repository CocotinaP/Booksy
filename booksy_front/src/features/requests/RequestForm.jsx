import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import { useRequestMutations } from "../features/requests/useRequestMutations";
import { requestApi } from "../api";

export default function RequestForm({ bookId, open, onClose }) {
  const { createRequest } = useRequestMutations(requestApi);
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.start_date || !form.end_date) {
      setError("Completează datele de început și sfârșit.");
      return;
    }

    try {
      await createRequest.mutateAsync({
          book: bookId.id || bookId,
          start_date: form.start_date,
          end_date: form.end_date,
          message: form.message,
        });

      alert("Cererea de închiriere a fost trimisă!");
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Eroare la trimiterea cererii.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Trimite cerere de închiriere</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Data început"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Data sfârșit"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Mesaj (opțional)"
              name="message"
              multiline
              rows={3}
              value={form.message}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Anulează</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createRequest.isLoading}
          >
            {createRequest.isLoading ? "Se trimite..." : "Trimite cererea"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
