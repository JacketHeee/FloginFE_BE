import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../LoginForm";
import { AuthProvider } from "../../../contexts/AuthContext";
import "@testing-library/jest-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock authService
jest.mock("../../../services/authService", () => ({
  login: jest.fn(),
}));

const authService = require("../../../services/authService");

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm onSwitchToRegister={() => {}} />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("LoginForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render login form with all elements", () => {
      renderLoginForm();

      expect(screen.getByText(/Xin chào!/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Tên đăng nhập/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Nhập mật khẩu của bạn/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Đăng nhập/i })
      ).toBeInTheDocument();
    });

    it("should render password input as type password", () => {
      renderLoginForm();

      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should have default values in inputs initially", () => {
      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );

      // Component has default values
      expect(usernameInput).toHaveValue("jackethee");
      expect(passwordInput).toHaveValue("admin123");
    });
  });

  describe("Input Validation", () => {
    it("should update username input value when typing", () => {
      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      fireEvent.change(usernameInput, { target: { value: "testuser" } });

      expect(usernameInput).toHaveValue("testuser");
    });

    it("should update password input value when typing", () => {
      renderLoginForm();

      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      fireEvent.change(passwordInput, { target: { value: "testpass123" } });

      expect(passwordInput).toHaveValue("testpass123");
    });

    it("should show error when submitting with empty username", async () => {
      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      // Clear username and set password
      fireEvent.change(usernameInput, { target: { value: "" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Vui lòng nhập username/i)).toBeInTheDocument();
      });
    });

    it("should show error when submitting with empty password", async () => {
      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      // Set username and clear password
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Vui lòng nhập mật khẩu/i)).toBeInTheDocument();
      });
    });
  });

  describe("Login Submission", () => {
    it("should call login service with correct credentials", async () => {
      authService.login.mockResolvedValue({
        token: "test-token",
        user: { id: 1, username: "admin", role: "admin" },
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "admin123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith("admin", "admin123");
      });
    });

    it("should navigate to products on successful login", async () => {
      authService.login.mockResolvedValue({
        token: "test-token",
        user: { id: 1, username: "admin", role: "admin" },
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "admin123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/products");
      });
    });

    it("should show error message on failed login", async () => {
      authService.login.mockRejectedValue(new Error("Login failed"));

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "wronguser" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpass123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Sai tên đăng nhập hoặc mật khẩu/i)
        ).toBeInTheDocument();
      });
    });

    it("should disable submit button while loading", async () => {
      authService.login.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              token: "test-token",
              user: { id: 1, username: "admin" },
            });
          }, 100);
        });
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "admin123" } });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle network error gracefully", async () => {
      authService.login.mockRejectedValue(new Error("Network error"));

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "admin123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Sai tên đăng nhập hoặc mật khẩu/i)
        ).toBeInTheDocument();
      });
    });

    it("should clear error message when user types", async () => {
      authService.login.mockRejectedValue(new Error("Login failed"));

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      // Submit with wrong credentials
      fireEvent.change(usernameInput, { target: { value: "wrong" } });
      fireEvent.change(passwordInput, { target: { value: "wrong123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Sai tên đăng nhập hoặc mật khẩu/i)
        ).toBeInTheDocument();
      });

      // Type new input - error should clear
      fireEvent.change(usernameInput, { target: { value: "admin" } });

      await waitFor(() => {
        expect(
          screen.queryByText(/Sai tên đăng nhập hoặc mật khẩu/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Events", () => {
    it("should submit form when pressing Enter key", async () => {
      authService.login.mockResolvedValue({
        token: "test-token",
        user: { id: 1, username: "admin" },
      });

      renderLoginForm();

      const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
      const passwordInput = screen.getByPlaceholderText(
        /Nhập mật khẩu của bạn/i
      );
      const form = screen
        .getByRole("button", { name: /Đăng nhập/i })
        .closest("form");

      fireEvent.change(usernameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "admin123" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });
  });
});
