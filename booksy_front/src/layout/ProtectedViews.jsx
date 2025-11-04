import { Outlet, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container, Box, Stack } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedViews() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>My App</Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/books">Books</Button>
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
