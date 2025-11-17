/**
 * MOCK TEST — LOGIN FORM
 * Yêu cầu (2.5 điểm):
 * ✔ Mock authService.loginUser()
 * ✔ Test successful + failed mock responses
 * ✔ Verify mock calls
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";
import { AuthProvider } from "../../../contexts/AuthContext";
import { login as loginApi } from "../../../services/authService";
import { BrowserRouter } from "react-router-dom";

// -------------------------
// MOCK authService.login()
// -------------------------
jest.mock("../../../services/authService");

// -------------------------
// Mock useNavigate
// -------------------------
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

// Helper render component
const renderLoginForm = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm onSwitchToRegister={jest.fn()} />
      </AuthProvider>
    </BrowserRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("LoginForm Mock Testing", () => {
  // ----------------------------------------------------
  // (1) Mock SUCCESSFUL RESPONSE
  // ----------------------------------------------------
  test("Login thành công → lưu token + chuyển hướng /products", async () => {
    loginApi.mockResolvedValue({ token: "FAKE_LOGIN_TOKEN" });

    renderLoginForm();

    fireEvent.change(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "jackethee" }
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "admin123" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      // Verify API gọi đúng tham số
      expect(loginApi).toHaveBeenCalledWith("jackethee", "admin123");

      // Verify token được lưu
      expect(localStorage.getItem("token")).toBe("FAKE_LOGIN_TOKEN");

      // Verify chuyển trang
      expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
  });

  // ----------------------------------------------------
  // (2) Mock FAILED RESPONSE
  // ----------------------------------------------------
  test("Login thất bại → hiển thị lỗi cho người dùng", async () => {
    loginApi.mockRejectedValue(new Error("Invalid credentials"));

    renderLoginForm();

    fireEvent.change(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "wrong" }
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "adc123" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    expect(
      await screen.findByText("Sai tên đăng nhập hoặc mật khẩu, vui lòng thử lại.")
    ).toBeInTheDocument();
    
    // Verify mock được gọi
    expect(loginApi).toHaveBeenCalledTimes(1);
  });
});
