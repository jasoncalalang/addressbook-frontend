import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import authService from '../AuthService';  // Import your AuthService

function ContactDetails() {
  const [contact, setContact] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const accessToken = await authService.getAccessToken();  // Get the access token
        if (!accessToken) {
          throw new Error('No access token available');
        }

        // Fetch the contact details with Authorization header
        const response = await axios.get(`http://localhost:5000/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Inject the token here
          },
        });
        
        setContact(response.data);
      } catch (error) {
        console.error('Error fetching contact details:', error);
      }
    };

    fetchContactDetails();
  }, [id]);

  if (!contact) {
    return <p>Loading contact details...</p>;
  }

  return (
    <div>
      <h2>{contact.name}</h2>
      <p>
        <strong>Email:</strong> {contact.email}
      </p>
      <p>
        <strong>Phone:</strong> {contact.phone}
      </p>
      <p>
        <strong>Address:</strong> {contact.address}
      </p>
    </div>
  );
}

export default ContactDetails;
