/*
CHECKLIST TEST (TIẾNG VIỆT)
- Test hiển thị đầy đủ input
- Test validate các trường bắt buộc
- Test validateUsername + validatePassword (mock)
- Test repassword không khớp
- Test chưa tick agreeToTerms
- Test submit thành công (mock register)
- Test submit thất bại (API lỗi → hiện thông báo lỗi)
- Test nút show/hide mật khẩu
- Test chuyển sang màn hình Login
*/

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "../RegisterForm";
import { register } from "../../../services/authService";
import { validateUsername, validatePassword } from "../../../utils/validate";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../../services/authService");
jest.mock("../../../utils/validate");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderForm = (props = {}) =>
  render(
    <BrowserRouter>
      <RegisterForm onSwitchToLogin={jest.fn()} {...props} />
    </BrowserRouter>
  );

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validateUsername.mockReturnValue(null);
    validatePassword.mockReturnValue(null);
  });

  test("Hiển thị đầy đủ các trường input", () => {
    renderForm();

    expect(screen.getByPlaceholderText("Họ và")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tên")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tên đăng nhập")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mật khẩu của bạn")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập lại mật khẩu")).toBeInTheDocument();
  });

  test("Hiển thị lỗi khi các trường bắt buộc bị bỏ trống", async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Họ và"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Tên"), { target: { value: "" } });

    validateUsername.mockReturnValue("Username không hợp lệ");
    validatePassword.mockReturnValue("Password không hợp lệ");

    fireEvent.submit(screen.getByRole("button", { name: "Đăng ký" }));

    expect(await screen.findByText("Vui lòng nhập họ")).toBeInTheDocument();
    expect(screen.getByText("Vui lòng nhập tên")).toBeInTheDocument();
    expect(screen.getByText("Username không hợp lệ")).toBeInTheDocument();
    expect(screen.getByText("Password không hợp lệ")).toBeInTheDocument();
  });

  test("Hiển thị lỗi khi chưa nhập lại mật khẩu", async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Nhập lại mật khẩu"), {
      target: { value: "" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Đăng ký" }));

    expect(await screen.findByText("Vui lòng nhập lại mật khẩu")).toBeInTheDocument();
  });

  test("Hiển thị lỗi khi mật khẩu nhập lại không khớp", async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Nhập lại mật khẩu"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Đăng ký" }));

    expect(await screen.findByText("Mật khẩu nhập lại không khớp")).toBeInTheDocument();
  });

  test("Hiển thị lỗi khi chưa đồng ý điều khoản", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("checkbox")); // uncheck

    fireEvent.submit(screen.getByRole("button", { name: "Đăng ký" }));

    expect(await screen.findByText("Vui lòng đồng ý với điều khoản")).toBeInTheDocument();
  });

  test("Đăng ký thành công → điều hướng sang trang Login", async () => {
    register.mockResolvedValue({ id: 1 });

    renderForm();

    fireEvent.submit(screen.getByRole("button", { name: "Đăng ký" }));

    await waitFor(() => {
      expect(register).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("Đăng ký thất bại → hiển thị lỗi API", async () => {
    register.mockRejectedValue(new Error("User exists"));

    renderForm();

    fireEvent.submit(screen.getByRole("button", { name: "Đăng ký" }));

    expect(await screen.findByText("Tên đăng nhập đã tồn tại")).toBeInTheDocument();
  });

  test("Bật/tắt hiển thị mật khẩu", () => {
    renderForm();

    const toggleButton = screen.getAllByRole("button")[1];

    fireEvent.click(toggleButton);

    expect(screen.getByPlaceholderText("Mật khẩu của bạn").type).toBe("text");
  });

  test("Click vào link 'Đăng nhập ngay' → gọi callback", () => {
    const fn = jest.fn();
    renderForm({ onSwitchToLogin: fn });

    fireEvent.click(screen.getByText("Đăng nhập ngay"));

    expect(fn).toHaveBeenCalled();
  });
});
