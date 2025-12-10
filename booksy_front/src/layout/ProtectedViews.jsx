import { Outlet, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container, Box, Stack } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import HandshakeIcon from "@mui/icons-material/Handshake";
import "../styles/ProtectedViews.css";
import NotificationBell from "../components/NotificationBell";


export default function ProtectedViews() {
  const { logout,user } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box className="protected-layout">
      <AppBar position="sticky" className="app-bar">
        <Toolbar className="toolbar">
          <Box className="logo-container">
            <MenuBookIcon className="logo-icon" />
            <Typography variant="h6" className="app-title">
              Booksy
            </Typography>
          </Box>
          <Box sx={{ marginLeft: "auto", marginRight: 3, display: "flex", alignItems: "center", gap: "10px" }}>
              <NotificationBell />
              <Typography variant="body1">
                {user?.first_name} {user?.last_name}
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#f0c419" }}>
                ⭐ {user?.rating ?? 0}
              </Typography>
          </Box>
          <Stack direction="row" spacing={2} className="nav-buttons">
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              className="nav-button"
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/listbooks" 
              className="nav-button"
              startIcon={<ListAltIcon />}
            >
              Book List
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/requests"
              className="nav-button"
              startIcon={<HandshakeIcon />}
            >
              Rental Requests
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/book-announcements"
              className="nav-button"
              startIcon={<ListAltIcon />}
            >
              Announcements
            </Button>

            <Button 
              color="inherit" 
              onClick={onLogout} 
              className="nav-button logout-button"
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container className="main-container">
        <Outlet />
      </Container>
    </Box>
  );
}