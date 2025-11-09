import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Box, TextField, Button, Typography, Link, Paper, Grid } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { validateRegisterForm } from "../validators/userValidator";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const validationErrors = validateRegisterForm(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await register(data);
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className="register-page">
      <Container maxWidth="sm">
        <Paper elevation={6} className="register-paper">
          <Box component="form" onSubmit={handleSubmit} className="register-form">
            <Typography variant="h4" className="register-title">
              Create Account
            </Typography>
            
            <Typography variant="body2" className="register-subtitle">
              Fill in the details below to get started
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="first_name"
                  label="First Name"
                  required
                  fullWidth
                  className="register-input"
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="last_name"
                  label="Last Name"
                  required
                  fullWidth
                  className="register-input"
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              name="username"
              label="Username"
              required
              fullWidth
              className="register-input"
              error={!!errors.username}
              helperText={errors.username}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              required
              fullWidth
              className="register-input"
              error={!!errors.password}
              helperText={errors.password}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              className="register-input"
              error={!!errors.email}
              helperText={errors.email}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="phone_number"
              label="Phone Number"
              fullWidth
              className="register-input"
              error={!!errors.phone_number}
              helperText={errors.phone_number}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="address"
              label="Address"
              fullWidth
              className="register-input"
              error={!!errors.address}
              helperText={errors.address}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              className="register-button"
            >
              Create Account
            </Button>

            <Typography className="register-footer">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" className="register-link">
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}