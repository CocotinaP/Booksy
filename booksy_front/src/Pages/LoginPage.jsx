import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await login({ email: data.get("email"), password: data.get("password") });
    // navigation will happen via effect when isAuthenticated flips
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, display: "grid", gap: 2 }}>
        <Typography variant="h5" textAlign="center">Login</Typography>
        <TextField name="email" label="Email" type="email" fullWidth required />
        <TextField name="password" label="Password" type="password" fullWidth required />
        <Button type="submit" variant="contained" size="large">Sign in</Button>
      </Box>
    </Container>
  );
}
