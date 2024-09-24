import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import authService from '../AuthService';  // Import AuthService to get the token

function EditContactForm() {
  const { id } = useParams();
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const accessToken = await authService.getAccessToken();  // Get the access token
        if (!accessToken) {
          throw new Error('No access token available');
        }

        const response = await axiosInstance.get(`/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Inject the token here
          },
        });
        setContact(response.data);
      } catch (error) {
        console.error('Error fetching contact details:', error);
        setError('Failed to fetch contact details.');
      }
    };

    fetchContact();
  }, [id]);

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

      await axiosInstance.put(`/contacts/${id}`, contact, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Inject the token here
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('Failed to update contact.');
    }
  };

  return (
    <div>
      <h2>Edit Contact</h2>
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
        <button type="submit">Update Contact</button>
      </form>
    </div>
  );
}

export default EditContactForm;