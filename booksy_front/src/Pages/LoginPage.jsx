import { useEffect } from "react";
import { useLocation, useNavigate, Link as RouterLink} from "react-router-dom";
import { Container, Box, TextField, Button, Typography, Link } from "@mui/material";
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
    await login({ username: data.get("username"), password: data.get("password") });
    // navigation will happen via effect when isAuthenticated flips
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, display: "grid", gap: 2 }}>
        <Typography variant="h5" textAlign="center">Login</Typography>
        <TextField name="username" label="Username" type="string" fullWidth required />
        <TextField name="password" label="Password" type="password" fullWidth required />
        <Button type="submit" variant="contained" size="large">Sign in</Button>

        <Typography textAlign="center">
          Don’t have an account?{" "}
          <Link component={RouterLink} to="/register">
          Register
          </Link>
        </Typography>

      </Box>
    </Container>
  );
}
