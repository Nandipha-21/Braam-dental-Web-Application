import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterUser } from './path/to/your/register/form';  // Adjust the import to where the RegisterUser function is located
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

// Mock Firebase methods
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  set: jest.fn(),
  ref: jest.fn(),
}));

describe('Register Form', () => {
  beforeEach(() => {
    // Mock the database and auth instances
    getAuth.mockReturnValue({
      currentUser: { uid: 'test-uid' },
    });

    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid', email: 'test@example.com' },
    });

    set.mockResolvedValue({});
  });

  test('should show error messages for invalid inputs', () => {
    render(<form onSubmit={RegisterUser} id="MainForm"></form>);

    const nameInput = screen.getByPlaceholderText('Name');
    const surnameInput = screen.getByPlaceholderText('Surname');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Register');

    // Fire submit event without filling out inputs
    fireEvent.submit(submitButton);

    // Check for error messages after validation
    expect(screen.getByText('Please enter a valid name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid surname.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid phone number ( 10 digits).')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.')).toBeInTheDocument();
  });

  test('should submit valid form data to Firebase', async () => {
    render(<form onSubmit={RegisterUser} id="MainForm"></form>);

    // Fill in valid input values
    const nameInput = screen.getByPlaceholderText('Name');
    const surnameInput = screen.getByPlaceholderText('Surname');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Register');

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    // Fire submit event with valid input values
    fireEvent.submit(submitButton);

    // Expect Firebase methods to be called
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'john.doe@example.com',
      'Password123!'
    );

    // Expect Firebase Realtime Database set method to be called with user data
    expect(set).toHaveBeenCalledWith(
      expect.anything(),
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      }
    );
  });

  test('should not submit the form if validation fails', async () => {
    render(<form onSubmit={RegisterUser} id="MainForm"></form>);

    // Fire submit event without valid input values
    const submitButton = screen.getByText('Register');
    fireEvent.submit(submitButton);

    // Assert that Firebase functions are not called when validation fails
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });
});
