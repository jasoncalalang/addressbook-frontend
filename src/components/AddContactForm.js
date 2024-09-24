import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import authService from '../AuthService';  // Import AuthService to get the token

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
      const accessToken = await authService.getAccessToken();  // Get the access token
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await axiosInstance.post('/contacts', contact, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Inject the token here
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact.');
    }
  };

  return (
    <div>
      <h2>Add Contact</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <textarea
            name="address"
            value={contact.address}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
}

export default AddContactForm;