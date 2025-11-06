import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const validate = (data) => {
    const newErrors = {};

    if (!data.username || data.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!data.password || data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!data.first_name) {
      newErrors.first_name = "First name is required.";
    }

    if (!data.last_name) {
      newErrors.last_name = "Last name is required.";
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (data.phone_number && data.phone_number.length < 10) {
      newErrors.phone_number = "Phone number must be at least 10 digits.";
    }

    if (!data.address) {
    newErrors.address = "Address is required.";
    }



    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await register(data);
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, display: "grid", gap: 2 }}>
        <Typography variant="h5" textAlign="center">Register</Typography>

        <TextField 
          name="username" 
          label="Username" 
          required 
          fullWidth 
          error={!!errors.username}
          helperText={errors.username}
        />

        <TextField 
          name="password" 
          label="Password" 
          type="password" 
          required 
          fullWidth 
          error={!!errors.password}
          helperText={errors.password}
        />

        <TextField 
          name="first_name" 
          label="First Name" 
          required 
          fullWidth
          error={!!errors.first_name}
          helperText={errors.first_name}
        />

        <TextField 
          name="last_name" 
          label="Last Name" 
          required 
          fullWidth
          error={!!errors.last_name}
          helperText={errors.last_name}
        />

        <TextField 
          name="email" 
          label="Email" 
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField 
          name="phone_number" 
          label="Phone Number" 
          fullWidth
          error={!!errors.phone_number}
          helperText={errors.phone_number}
        />

        <TextField 
            name="address" 
            label="Address" 
            fullWidth
            error={!!errors.address}
            helperText={errors.address}
        />

        <Button type="submit" variant="contained" size="large">
          Create Account
        </Button>
      </Box>
    </Container>
  );
}
