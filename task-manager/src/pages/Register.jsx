import { TextField, Button, Typography, Container, Box, Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from 'react-router';
import api from './../api/Axios';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", { email, password });
            setSnackbar({ open: true, message: "Registration successful! Redirecting to login..." });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. User might already exist.");
        } finally {
            setLoading(false);
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
                    component="form"
                    onSubmit={handleRegister}
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
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Register
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Registering..." : "Register"}
                    </Button>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Register;
