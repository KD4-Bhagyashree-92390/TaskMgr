import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from 'react-router';
import api from './../api/Axios';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      navigate("/tasks");
    } catch (error) {
      alert("Invalid Credentials !!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Login
          </Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{ mt: 1 }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
              Register Here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;