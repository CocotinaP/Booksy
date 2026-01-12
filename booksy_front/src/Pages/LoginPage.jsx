import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Box, TextField, Button, Typography, Link, Paper, Alert } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); // resetează eroarea la fiecare submit
    const data = new FormData(e.currentTarget);

    try {
      await login({ username: data.get("username"), password: data.get("password") });
    } catch (error) {
      // Dacă backend-ul returnează mesaj de eroare
      if (error.response?.data?.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("Invalid username or password");
      }
    }
  };

  return (
    <div className="login-page">
      <Container maxWidth="xs">
        <Paper elevation={6} className="login-paper">
          <Box component="form" onSubmit={handleSubmit} className="login-form">
            <Typography variant="h4" className="login-title">
              Welcome Back
            </Typography>

            <Typography variant="body2" className="login-subtitle">
              Sign in to continue to your account
            </Typography>

            {/* Mesaj de eroare */}
            {loginError && (
              <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                {loginError}
              </Alert>
            )}

            <TextField
              name="username"
              label="Username"
              type="text"
              variant="outlined"
              fullWidth
              required
              className="login-input"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              className="login-input"
              InputLabelProps={{ shrink: true }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              className="login-button"
            >
              Sign In
            </Button>

            <Typography className="login-footer">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" className="login-link">
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
