import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../AuthService';
import { Container, Button, Alert } from 'react-bootstrap';  // Import React Bootstrap components

function LoginPage({ onLogin }) {
  const [error, setError] = useState(null);  // State to track login errors
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await authService.login();  // Calls login to generate tokens
      onLogin();                  // Update the app state (set user as logged in)
      navigate('/');              // Redirect to the contacts page
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" onClick={handleLogin}>
        Login with IBM App ID
      </Button>
    </Container>
  );
}

export default LoginPage;