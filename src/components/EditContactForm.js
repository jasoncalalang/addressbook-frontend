// src/components/EditContactForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditContactForm() {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/contacts/${id}`)
      .then((response) => {
        setContact(response.data);
      })
      .catch((error) => {
        console.error('Error fetching contact:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/contacts/${id}`, contact)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error updating contact:', error);
      });
  };

  return (
    <div>
      <h2>Edit Contact</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={contact.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        {/* Email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={contact.email || ''}
            onChange={handleChange}
            required
          />
        </div>
        {/* Phone */}
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={contact.phone || ''}
            onChange={handleChange}
          />
        </div>
        {/* Address */}
        <div>
          <label>Address:</label>
          <textarea
            name="address"
            value={contact.address || ''}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* Submit */}
        <button type="submit">Update Contact</button>
      </form>
    </div>
  );
}

export default EditContactForm;

