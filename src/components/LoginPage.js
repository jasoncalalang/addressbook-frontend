import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../AuthService';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await authService.login();  // Calls login to generate tokens
      onLogin();                  // Update the app state (set user as logged in)
      navigate('/');              // Redirect to the contacts page
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with IBM App ID</button>
    </div>
  );
}

export default LoginPage;