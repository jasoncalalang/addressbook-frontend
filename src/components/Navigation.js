import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../AuthService';

function Navigation({ isAuthenticated, onLogout }) {
  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav>
      <h1>Address Book</h1>
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/">Contacts</Link>
            </li>
            <li>
              <Link to="/add">Add Contact</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
