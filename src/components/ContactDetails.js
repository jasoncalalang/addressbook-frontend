// src/components/ContactDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ContactDetails() {
  const [contact, setContact] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/contacts/${id}`)
      .then((response) => {
        setContact(response.data);
      })
      .catch((error) => {
        console.error('Error fetching contact details:', error);
      });
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

