import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import authService from '../AuthService';
import { Form, Button, Container, Alert } from 'react-bootstrap';  // Import React Bootstrap components

function AddContactForm() {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = await authService.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await axiosInstance.post('/contacts', contact, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add Contact</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPhone" className="mt-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formAddress" className="mt-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            name="address"
            value={contact.address}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Add Contact
        </Button>
      </Form>
    </Container>
  );
}

export default AddContactForm;