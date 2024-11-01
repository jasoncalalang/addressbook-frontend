import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import authService from '../AuthService';
import { Table, Button, Container, Alert, Spinner } from 'react-bootstrap';  

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const accessToken = await authService.getAccessToken();
        if (!accessToken) {
          throw new Error('No access token available');
        }

        const response = await axiosInstance.get('/contacts', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setContacts(response.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to fetch contacts.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    try {
      const accessToken = await authService.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await axiosInstance.delete(`/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact.');
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!contacts.length) {
    return (
      <Container className="mt-4">
        <Alert variant="info">No contacts available.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Contacts</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>
                <Link to={`/contacts/${contact._id}`}>{contact.name}</Link>
              </td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.address}</td>
              <td>
                <Link to={`/edit/${contact._id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                <Button variant="danger" size="sm" onClick={() => deleteContact(contact._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ContactList;