import { signInWithEmailAndPassword } from 'firebase/auth'; // Mocking Firebase auth
import { getDatabase, get, ref, child } from 'firebase/database';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  get: jest.fn(),
  ref: jest.fn(),
  child: jest.fn(),
}));

describe('Login Form', () => {
  let emailInput, passwordInput, form, alertMock;

  beforeEach(() => {
    // Setup HTML structure for tests
    document.body.innerHTML = `
      <form id="MainForm">
        <input id="emailIn" type="email" />
        <input id="passwordIn" type="password" />
        <button type="submit">Login</button>
      </form>
    `;

    emailInput = document.getElementById('emailIn');
    passwordInput = document.getElementById('passwordIn');
    form = document.getElementById('MainForm');

    // Mock the global alert function
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock the Firebase response for successful login
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'testUser123' }
    });

    get.mockResolvedValue({
      exists: () => true,
      val: () => ({ firstName: 'John', lastName: 'Doe' }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show alert when email is empty', () => {
    emailInput.value = '';
    passwordInput.value = 'validPassword';
    form.dispatchEvent(new Event('submit'));
    expect(alertMock).toHaveBeenCalledWith('Please enter your email address.');
  });

  test('should show alert when password is empty', () => {
    emailInput.value = 'test@example.com';
    passwordInput.value = '';
    form.dispatchEvent(new Event('submit'));
    expect(alertMock).toHaveBeenCalledWith('Please enter your password.');
  });

  test('should sign in the user and redirect if login is successful', async () => {
    emailInput.value = 'test@example.com';
    passwordInput.value = 'validPassword';
    
    form.dispatchEvent(new Event('submit'));

    // Wait for promises to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object), // auth object
      'test@example.com',
      'validPassword'
    );
    expect(get).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith('Login successful! Redirecting...');
    expect(window.location.href).toBe('home.html');
  });

  test('should show alert if user is not found in database', async () => {
    get.mockResolvedValueOnce({
      exists: () => false,
    });

    emailInput.value = 'test@example.com';
    passwordInput.value = 'validPassword';

    form.dispatchEvent(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(alertMock).toHaveBeenCalledWith('User data not found. Please contact support.');
  });

  test('should show specific error for wrong password', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });

    emailInput.value = 'test@example.com';
    passwordInput.value = 'invalidPassword';
    
    form.dispatchEvent(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(alertMock).toHaveBeenCalledWith('Incorrect password. Please try again.');
  });
});
