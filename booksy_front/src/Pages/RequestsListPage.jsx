import { useState } from "react";
import { Box, Tabs, Tab, List, Typography, CircularProgress, Alert } from "@mui/material";
import Request from "../request/Request";
import { useAuth } from "../auth/AuthContext";
import { useRequests } from "../features/requests/useRequests";
import { useRequestMutations } from "../features/requests/useRequestMutations";
import { requestApi } from "../api/index";

export default function RequestsListPage() {
  const { user } = useAuth();
  const currentUser = user?.username;

  const [tab, setTab] = useState(0); // 0 = incoming, 1 = outgoing
  const type = tab === 0 ? "incoming" : "outgoing";

  // Fetch all requests
  const { data, isLoading, error, refetch } = useRequests(requestApi);
  const allRequests = data?.items ?? [];

  // Filter requests based on current user
  const incomingRequests = allRequests.filter(
    (r) => r.book.owner === currentUser && r.requester.username !== currentUser
  );

  const outgoingRequests = allRequests.filter(
    (r) => r.requester.username === currentUser
  );

  const requests = tab === 0 ? incomingRequests : outgoingRequests;

  // Mutations for Accept/Decline
  const { acceptRequest, refuseRequest } = useRequestMutations(requestApi);

  const handleAccept = async (id) => {
    try {
      await acceptRequest.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineRequest.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error("Failed to decline request:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Book Requests
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab label="Received" />
        <Tab label="Sent" />
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error.message || "Failed to load requests"}</Alert>
      ) : requests.length === 0 ? (
        <Typography color="text.secondary">
          {tab === 0
            ? "No received requests yet."
            : "No sent requests yet."}
        </Typography>
      ) : (
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {requests.map((req) => (
            <Request
              key={req.id}
              request={req}
              type={type}
              onApprove={handleAccept}
              onReject={handleDecline}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
