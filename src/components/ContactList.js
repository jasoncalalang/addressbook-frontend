import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import authService from '../AuthService';  // Import AuthService to get the token

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const accessToken = await authService.getAccessToken();  // Get the access token
        if (!accessToken) {
          throw new Error('No access token available');
        }

        const response = await axiosInstance.get('/contacts', {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Inject the token here
          },
        });
        setContacts(response.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to fetch contacts.');
      }
    };

    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    try {
      const accessToken = await authService.getAccessToken();  // Get the access token
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await axiosInstance.delete(`/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Inject the token here
        },
      });
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!contacts.length) {
    return <div>No contacts available.</div>;
  }

  return (
    <div>
      <h2>Contacts</h2>
      <table>
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
                <Link to={`/edit/${contact._id}`}>Edit</Link> |{' '}
                <button onClick={() => deleteContact(contact._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactList;
