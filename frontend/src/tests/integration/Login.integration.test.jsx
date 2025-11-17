/**
 * INTEGRATION TEST — LOGIN FORM
 * ✔ Render + user interactions
 * ✔ Submit form + API call
 * ✔ Success + error handling
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../../components/LoginForm/LoginForm";
import { login as loginApi } from "../../services/authService";
import { AuthProvider } from "../../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import {
  validateUsername,
  validatePassword,
} from "../../utils/validate";

// Mock API login
jest.mock("../../services/authService");

// Mock validations (để không chặn API)
jest.mock("../../utils/validate", () => ({
  validateUsername: jest.fn(),
  validatePassword: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderLogin = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm onSwitchToRegister={jest.fn()} />
      </AuthProvider>
    </BrowserRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  validateUsername.mockReturnValue(null);
  validatePassword.mockReturnValue(null);
  localStorage.clear();
});

describe("Login Integration Test", () => {
  // ==============================
  // (A) Render + User Interaction
  // ==============================
  test("Render đúng UI và cho phép nhập liệu", () => {
    renderLogin();

    expect(screen.getByPlaceholderText("Tên đăng nhập")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập mật khẩu của bạn")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "manh123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "abc12345" },
    });

    expect(screen.getByPlaceholderText("Tên đăng nhập").value).toBe("manh123");
    expect(screen.getByPlaceholderText("Nhập mật khẩu của bạn").value).toBe("abc12345");
  });

  // ==============================
  // (B) Submit form + API call
  // ==============================
  test("Submit form → gọi API login → navigate thành công", async () => {
    loginApi.mockResolvedValue({ token: "FAKE_TOKEN_123" });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "jackethee" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      expect(loginApi).toHaveBeenCalledWith("jackethee", "admin123");
      expect(localStorage.getItem("token")).toBe("FAKE_TOKEN_123");
      expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
  });

  // ==============================
  // (C) Error handling API
  // ==============================
  test("API login thất bại → hiển thị lỗi", async () => {
    loginApi.mockRejectedValue(new Error("Invalid credentials"));

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "wronguser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    // dùng regex vì lỗi có thể bị split bởi SVG hoặc xuống dòng
    expect(
      await screen.findByText(/Sai tên đăng nhập hoặc mật khẩu/i)
    ).toBeInTheDocument();
  });
});
