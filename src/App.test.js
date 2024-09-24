import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import authService from './AuthService'; // Mock the AuthService
import axios from 'axios'; // Mock Axios

// Mock AuthService methods
jest.mock('./AuthService', () => ({
  init: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(),
  getAccessToken: jest.fn(),
}));

// Mock axios
jest.mock('axios');

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('renders login page when user is not authenticated', () => {
    // Simulate user is not authenticated
    authService.isAuthenticated.mockReturnValue(false);

    render(<App />);

    // Expect to see the login button
    const loginButton = screen.getByText(/Login with IBM App ID/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('renders contact list when user is authenticated', async () => {
    // Simulate user is authenticated
    authService.isAuthenticated.mockReturnValue(true);

    // Mock axios call to fetch contacts
    axios.get.mockResolvedValue({
      data: [
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', address: '456 Maple Ave' },
      ],
    });

    render(<App />);

    // Wait for contacts to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('renders logout button when user is authenticated', async () => {
    // Simulate user is authenticated
    authService.isAuthenticated.mockReturnValue(true);

    render(<App />);

    // Expect to see the logout button
    const logoutButton = screen.getByText(/Logout/i);
    expect(logoutButton).toBeInTheDocument();

    // Simulate logout
    fireEvent.click(logoutButton);

    // Expect AuthService logout to have been called
    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
    });
  });
});