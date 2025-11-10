import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { AuthProvider } from '../../../contexts/AuthContext';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock authService
jest.mock('../../../services/authService', () => ({
  login: jest.fn(),
}));

const authService = require('../../../services/authService');

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      renderLoginForm();

      expect(screen.getByText(/Đăng nhập/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Mật khẩu/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
    });

    it('should render password input as type password', () => {
      renderLoginForm();

      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have empty inputs initially', () => {
      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);

      expect(usernameInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Input Validation', () => {
    it('should update username input value when typing', () => {
      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });

      expect(usernameInput).toHaveValue('testuser');
    });

    it('should update password input value when typing', () => {
      renderLoginForm();

      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      fireEvent.change(passwordInput, { target: { value: 'testpass123' } });

      expect(passwordInput).toHaveValue('testpass123');
    });

    it('should show error when submitting with empty username', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Vui lòng nhập tên đăng nhập',
      });

      renderLoginForm();

      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Vui lòng nhập tên đăng nhập/i)).toBeInTheDocument();
      });
    });

    it('should show error when submitting with empty password', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Vui lòng nhập mật khẩu',
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Vui lòng nhập mật khẩu/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login Submission', () => {
    it('should call login service with correct credentials', async () => {
      authService.login.mockResolvedValue({
        success: true,
        token: 'test-token',
        user: { id: 1, username: 'admin', role: 'admin' },
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          username: 'admin',
          password: 'admin123',
        });
      });
    });

    it('should navigate to dashboard on successful login', async () => {
      authService.login.mockResolvedValue({
        success: true,
        token: 'test-token',
        user: { id: 1, username: 'admin', role: 'admin' },
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show error message on failed login', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng',
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Tên đăng nhập hoặc mật khẩu không đúng/i)).toBeInTheDocument();
      });
    });

    it('should disable submit button while loading', async () => {
      authService.login.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              success: true,
              token: 'test-token',
              user: { id: 1, username: 'admin' },
            });
          }, 100);
        });
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network error gracefully', async () => {
      authService.login.mockRejectedValue(new Error('Network error'));

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/lỗi/i)).toBeInTheDocument();
      });
    });

    it('should clear error message when user types', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng',
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });

      // Submit with wrong credentials
      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Tên đăng nhập hoặc mật khẩu không đúng/i)).toBeInTheDocument();
      });

      // Type new input - error should clear
      fireEvent.change(usernameInput, { target: { value: 'admin' } });

      await waitFor(() => {
        expect(screen.queryByText(/Tên đăng nhập hoặc mật khẩu không đúng/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Events', () => {
    it('should submit form when pressing Enter key', async () => {
      authService.login.mockResolvedValue({
        success: true,
        token: 'test-token',
        user: { id: 1, username: 'admin' },
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.keyDown(passwordInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });
  });
});
