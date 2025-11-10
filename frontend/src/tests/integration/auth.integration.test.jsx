import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { AuthProvider } from '../../contexts/AuthContext';
import * as authService from '../../services/authService';
import '@testing-library/jest-dom';

// Mock authService
jest.mock('../../services/authService');

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Login Flow', () => {
    it('should complete full login flow successfully', async () => {
      // Mock successful login
      authService.login.mockResolvedValue({
        success: true,
        token: 'test-token-123',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@test.com',
          role: 'admin',
        },
      });

      authService.verifyToken.mockResolvedValue({
        valid: true,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@test.com',
          role: 'admin',
        },
      });

      renderApp();

      // Should show login page initially
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      });

      // Enter credentials
      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      // Submit login
      const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });
      fireEvent.click(loginButton);

      // Should call login service
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          username: 'admin',
          password: 'admin123',
        });
      });

      // Should store token in localStorage
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('test-token-123');
      });

      // Should navigate to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should handle login failure with invalid credentials', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng',
      });

      renderApp();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      });

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      
      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

      const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });
      fireEvent.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Tên đăng nhập hoặc mật khẩu không đúng/i)).toBeInTheDocument();
      });

      // Should NOT store token
      expect(localStorage.getItem('token')).toBeNull();

      // Should NOT navigate
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle login with empty fields', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin',
      });

      renderApp();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      });

      const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Vui lòng nhập/i)).toBeInTheDocument();
      });
    });
  });

  describe('Token Persistence', () => {
    it('should restore session from localStorage on page reload', async () => {
      // Set token in localStorage
      localStorage.setItem('token', 'existing-token-123');

      authService.verifyToken.mockResolvedValue({
        valid: true,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@test.com',
          role: 'admin',
        },
      });

      renderApp();

      // Should verify token on mount
      await waitFor(() => {
        expect(authService.verifyToken).toHaveBeenCalledWith('existing-token-123');
      });

      // Should redirect to dashboard if already logged in
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should redirect to login if token is invalid', async () => {
      localStorage.setItem('token', 'invalid-token');

      authService.verifyToken.mockResolvedValue({
        valid: false,
      });

      renderApp();

      await waitFor(() => {
        expect(authService.verifyToken).toHaveBeenCalledWith('invalid-token');
      });

      // Should clear invalid token
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeNull();
      });

      // Should show login page
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      });
    });
  });

  describe('Logout Flow', () => {
    it('should complete logout flow successfully', async () => {
      // Setup logged in state
      localStorage.setItem('token', 'test-token-123');

      authService.verifyToken.mockResolvedValue({
        valid: true,
        user: { id: 1, username: 'admin', role: 'admin' },
      });

      authService.logout.mockResolvedValue({ success: true });

      renderApp();

      // Wait for auth verification
      await waitFor(() => {
        expect(authService.verifyToken).toHaveBeenCalled();
      });

      // Find and click logout button
      const logoutButton = screen.getByRole('button', { name: /Đăng xuất/i });
      fireEvent.click(logoutButton);

      // Should show confirmation popup
      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn đăng xuất/i)).toBeInTheDocument();
      });

      // Confirm logout
      const confirmButton = screen.getByRole('button', { name: /Đăng xuất/i });
      fireEvent.click(confirmButton);

      // Should call logout service
      await waitFor(() => {
        expect(authService.logout).toHaveBeenCalled();
      });

      // Should clear localStorage
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeNull();
      });

      // Should navigate to login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should cancel logout when clicking cancel', async () => {
      localStorage.setItem('token', 'test-token-123');

      authService.verifyToken.mockResolvedValue({
        valid: true,
        user: { id: 1, username: 'admin', role: 'admin' },
      });

      renderApp();

      await waitFor(() => {
        expect(authService.verifyToken).toHaveBeenCalled();
      });

      const logoutButton = screen.getByRole('button', { name: /Đăng xuất/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn đăng xuất/i)).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Hủy/i });
      fireEvent.click(cancelButton);

      // Should NOT call logout
      expect(authService.logout).not.toHaveBeenCalled();

      // Token should still be there
      expect(localStorage.getItem('token')).toBe('test-token-123');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without token', async () => {
      renderApp();

      // Try to navigate to dashboard
      window.history.pushState({}, 'Dashboard', '/dashboard');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should allow access to protected routes with valid token', async () => {
      localStorage.setItem('token', 'valid-token-123');

      authService.verifyToken.mockResolvedValue({
        valid: true,
        user: { id: 1, username: 'admin', role: 'admin' },
      });

      renderApp();

      // Navigate to dashboard
      window.history.pushState({}, 'Dashboard', '/dashboard');

      await waitFor(() => {
        expect(authService.verifyToken).toHaveBeenCalledWith('valid-token-123');
      });

      // Should stay on dashboard (not redirect to login)
      expect(mockNavigate).not.toHaveBeenCalledWith('/login');
    });
  });

  describe('Session Timeout', () => {
    it('should handle expired token gracefully', async () => {
      localStorage.setItem('token', 'expired-token');

      authService.verifyToken.mockResolvedValue({
        valid: false,
        message: 'Token expired',
      });

      renderApp();

      await waitFor(() => {
        expect(authService.verifyToken).toHaveBeenCalled();
      });

      // Should clear token
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeNull();
      });

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      });
    });
  });

  describe('Multiple Login Attempts', () => {
    it('should handle multiple failed login attempts', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng',
      });

      renderApp();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      });

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });

      // First attempt
      fireEvent.change(usernameInput, { target: { value: 'wrong1' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong1' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Tên đăng nhập hoặc mật khẩu không đúng/i)).toBeInTheDocument();
      });

      // Second attempt
      fireEvent.change(usernameInput, { target: { value: 'wrong2' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong2' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledTimes(2);
      });
    });

    it('should succeed after failed attempts', async () => {
      authService.login
        .mockResolvedValueOnce({
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        })
        .mockResolvedValueOnce({
          success: true,
          token: 'success-token',
          user: { id: 1, username: 'admin', role: 'admin' },
        });

      renderApp();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      });

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });

      // Failed attempt
      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Tên đăng nhập hoặc mật khẩu không đúng/i)).toBeInTheDocument();
      });

      // Successful attempt
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('success-token');
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
