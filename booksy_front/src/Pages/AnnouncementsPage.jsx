import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Stack,
  Paper,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementApi } from "../api";
import { useAuth } from "../auth/AuthContext";
import { httpClient } from "../api";
import { createAnnouncementResponseApi } from "../features/announcements/announcementResponseApi";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUserId = user?.id;
  const [tab, setTab] = useState("others");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", description: "" });
  const qc = useQueryClient();
  const responseApi = createAnnouncementResponseApi(httpClient);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyOpenFor, setReplyOpenFor] = useState(null);
  const [replyImage, setReplyImage] = useState(null);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const [replyPhoneModalOpen, setReplyPhoneModalOpen] = useState(false);
    const [replyPendingId, setReplyPendingId] = useState(null);
    const [replyPhoneInput, setReplyPhoneInput] = useState("");


   const { data, isLoading, error } = useQuery({
  queryKey: ["book-announcements"],
  queryFn: async () => {
    const res = await announcementApi.list();
    const list = Array.isArray(res) ? res : [];

    const myAnnouncements = list.filter(a => {
      // extragem username-ul dintre paranteze
      const match = a.publisher_full_name.trim().match(/\(([^)]+)\)/);
      if (!match) return false; // dacă nu există paranteze, nu e al meu
      const usernameInParens = match[1].trim();
      return usernameInParens === user.username;
    });

    const otherAnnouncements = list.filter(a => {
      const match = a.publisher_full_name.trim().match(/\(([^)]+)\)/);
      if (!match) return true; // dacă nu există paranteze, considerăm că nu e al meu
      const usernameInParens = match[1].trim();
      return usernameInParens !== user.username;
    });

    return { myAnnouncements, otherAnnouncements };
  },
});


  const createAnnouncement = useMutation({
    mutationFn: (data) => announcementApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries(["book-announcements"]);
      setOpenCreateModal(false);
      setFormData({ title: "", author: "", description: "" });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: (id) => announcementApi.delete(id),
    onSuccess: () => qc.invalidateQueries(["book-announcements"]),
  });

  const handleCreate = () => {
  // dacă nu avem număr de telefon
  if (!user.phone) {
    setPhoneModalOpen(true);
    return;
  }

  if (!formData.title || !formData.author) {
    alert("Titlu și autor sunt obligatorii");
    return;
  }

  createAnnouncement.mutate({
    ...formData,
    publisher: currentUserId,
    publisher_phone: user.phone
  });
};

    const savePhoneAndCreate = () => {
  if (!formData.title || !formData.author) {
    alert("Titlu și autor sunt obligatorii");
    return;
  }

  // Daca user nu are telefon și nu l-a introdus încă
  if (!user?.phone_number && !phoneInput) {
    setPhoneModalOpen(true);
    return;
  }

  // Trimite anuntul
  createAnnouncement.mutate({
    ...formData,
    publisher: currentUserId,
    phone_number: user?.phone_number || phoneInput.trim(), // doar local
  });
};

  const handleDelete = async (id) => {
    if (!confirm("Sigur vrei să ștergi acest anunț?")) return;
    await deleteAnnouncement.mutateAsync(id);
  };
const handleSendReply = async (announcementId) => {
  if (!replyMessage.trim()) {
    return alert("Mesajul nu poate fi gol!");
  if (!user?.phone && replyPhoneInput) {
  form.append("phone_number", replyPhoneInput.trim());
}

  }

  if (!replyImage) {
    return alert("Trebuie să încarci o imagine!");
  }

  try {
    const form = new FormData();
    form.append("announcement", announcementId); // OBLIGATORIU EXACT ASA
    form.append("message", replyMessage.trim());
    form.append("image", replyImage);

    await responseApi.create(form);

    setReplyMessage("");
    setReplyImage(null);
    setReplyOpenFor(null);

    alert("Răspuns trimis cu succes!");
  } catch (err) {
    console.error("EROARE SERVER:", err.payload || err);
    
    // Extrage mesajul de eroare din diferite locații posibile
    let errorMessage = "Eroare la trimitere răspuns.";
    
    if (err.payload) {
      // Verifică non_field_errors (erori generale de validare)
      if (err.payload.non_field_errors && Array.isArray(err.payload.non_field_errors) && err.payload.non_field_errors.length > 0) {
        errorMessage = err.payload.non_field_errors[0];
      } 
      // Verifică erori pe câmpuri specifice
      else if (err.payload.detail) {
        errorMessage = err.payload.detail;
      } 
      else if (err.payload.message) {
        errorMessage = err.payload.message;
      }
      // Verifică erori pe câmpuri (ex: {announcement: ["error"]})
      else {
        const fieldErrors = Object.values(err.payload).flat();
        if (fieldErrors.length > 0) {
          errorMessage = Array.isArray(fieldErrors[0]) ? fieldErrors[0][0] : fieldErrors[0];
        }
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    alert(`Eroare: ${errorMessage}`);
  }
};

  const handleOpenViewModal = (announcement) => {
    // Navighează la pagina de răspunsuri în loc de modal
    navigate(`/book-announcements/${announcement.id}/responses`);
  };

  const announcements = data
    ? tab === "mine"
      ? data.myAnnouncements
      : data.otherAnnouncements
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Anunțuri cărți</Typography>
        <Button variant="contained" onClick={() => setOpenCreateModal(true)}>Adaugă anunț</Button>
      </Stack>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Anunțurile mele" value="mine" />
        <Tab label="Alte anunțuri" value="others" />
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error.message || "Eroare la încărcarea anunțurilor."}</Alert>
      ) : announcements.length > 0 ? (
        <Stack spacing={2}>
          {announcements.map((a) => (
            <Paper
              key={a.id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: "5px solid grey.400",
                cursor: tab === "mine" ? "pointer" : "default", // doar anunțurile mele sunt clickabile
              }}
              onClick={() => tab === "mine" && handleOpenViewModal(a)}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">{a.title}</Typography>
                <Typography variant="body2" color="text.secondary">Autor: {a.author}</Typography>
                {a.description && <Typography variant="body2" color="text.secondary">{a.description}</Typography>}
                <Typography variant="body2" color="text.secondary">Publicat de: {a.publisherName || a.publisher}</Typography>
                {a.publisher_phone && (
                    <Typography variant="body2" color="text.secondary">
                      Telefon: <strong>{a.publisher_phone}</strong>
                    </Typography>
                  )}
                <Typography variant="body2" color="text.secondary">Creat la: {new Date(a.created_at).toLocaleDateString()}</Typography>
              </Box>

              {tab === "mine" && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // prevenim deschiderea modalului
                    handleDelete(a.id);
                  }}
                  disabled={deleteAnnouncement.isLoading}
                >
                  Șterge
                </Button>
              )}
                {tab === "others" && (
                  <>
                    {/* Afișează butonul doar dacă NU este deschis inputul */}
                    {replyOpenFor !== a.id && (
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user?.phone) {
                            setReplyPendingId(a.id);
                            setReplyPhoneModalOpen(true);
                          } else {
                            setReplyOpenFor(a.id);
                          }
                        }}
                      >
                        Răspunde
                      </Button>
                    )}


                    {/* Când inputul este deschis, butonul RASPUNDE dispare */}
                    {replyOpenFor === a.id && (
                      <Stack spacing={1} sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Scrie mesajul..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />

                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => setReplyImage(e.target.files[0])}
                        />

                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendReply(a.id);
                          }}
                        >
                          Trimite
                        </Button>
                      </Stack>
                    )}
                  </>
                )}


            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nu există anunțuri {tab === "mine" ? "ale tale" : "înregistrate"}.
        </Typography>
      )}

      {/* Modal pentru adăugare anunț */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Adaugă anunț</Typography>
          <TextField label="Titlu" fullWidth margin="normal" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <TextField label="Autor" fullWidth margin="normal" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
          <TextField label="Descriere" fullWidth margin="normal" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => setOpenCreateModal(false)}>Închide</Button>
            <Button variant="contained" onClick={handleCreate}>Posteaza</Button>
          </Stack>
        </Box>
      </Modal>

        <Modal open={phoneModalOpen} onClose={() => setPhoneModalOpen(false)}>
  <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, borderRadius: 1 }}>
    <Typography variant="h6" gutterBottom>Completează numărul de telefon</Typography>
    <TextField
      label="Număr de telefon"
      fullWidth
      value={phoneInput}
      onChange={(e) => setPhoneInput(e.target.value)}
    />
    <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "flex-end" }}>
      <Button variant="outlined" onClick={() => setPhoneModalOpen(false)}>Închide</Button>
      <Button variant="contained" onClick={savePhoneAndCreate}>Salvează și postează</Button>
    </Stack>
  </Box>
</Modal>

        <Modal open={replyPhoneModalOpen} onClose={() => setReplyPhoneModalOpen(false)}>
  <Box sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 1,
  }}>
    <Typography variant="h6" gutterBottom>Completează numărul de telefon</Typography>
    <TextField
      label="Număr de telefon"
      fullWidth
      value={replyPhoneInput}
      onChange={(e) => setReplyPhoneInput(e.target.value)}
    />
    <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "flex-end" }}>
      <Button variant="outlined" onClick={() => setReplyPhoneModalOpen(false)}>Închide</Button>
      <Button
        variant="contained"
        onClick={() => {
          if (!replyPhoneInput.trim()) {
            alert("Trebuie să introduci numărul de telefon!");
            return;
          }
          user.phone = replyPhoneInput.trim(); // doar local
          setReplyPhoneModalOpen(false);
          setReplyOpenFor(replyPendingId);
          setReplyPendingId(null);
        }}
      >
        Salvează și răspunde
      </Button>
    </Stack>
  </Box>
</Modal>

    </Box>
  );
}
