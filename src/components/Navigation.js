import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';  // Import React Bootstrap components
import authService from '../AuthService';

function Navigation({ isAuthenticated, onLogout }) {
  const handleLogout = async () => {
    try {
      await authService.logout();  // Perform the logout
      onLogout();  // Update the state in the parent component
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Address Book
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/">
                  Contacts
                </Nav.Link>
                <Nav.Link as={Link} to="/add">
                  Add Contact
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
          {isAuthenticated && (
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;