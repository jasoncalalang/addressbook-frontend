import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import authService from '../AuthService';  // Import your AuthService
import axiosInstance from '../api/axiosInstance';
import { Container, Card, Alert } from 'react-bootstrap';  // Import React Bootstrap components

function ContactDetails() {
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(null);  // State to track any errors
  const { id } = useParams();

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const accessToken = await authService.getAccessToken();  // Get the access token
        if (!accessToken) {
          throw new Error('No access token available');
        }

        // Fetch the contact details with Authorization header
        const response = await axiosInstance.get(`/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Inject the token here
          },
        });

        setContact(response.data);
      } catch (error) {
        console.error('Error fetching contact details:', error);
        setError('Failed to fetch contact details');
      }
    };

    fetchContactDetails();
  }, [id]);

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!contact) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Loading contact details...</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h2>{contact.name}</h2>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Email:</strong> {contact.email}
          </p>
          <p>
            <strong>Phone:</strong> {contact.phone}
          </p>
          <p>
            <strong>Address:</strong> {contact.address}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ContactDetails;