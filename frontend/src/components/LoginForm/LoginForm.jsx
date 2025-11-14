import { useEffect, useState } from "react";
import "./LoginForm.scss";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import Message from "../Message/Message";
import Icon from "../Icon/Icon";
import { validateUsername, validatePassword } from "../../utils/validate";

const LoginForm = ({ onSwitchToRegister }) => {
  const { logout, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const [formData, setFormData] = useState({
    username: "jackethee",
    password: "admin123",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Gọi API với username và password
        const response = await login(formData.username, formData.password);

        if (response?.token) {
          localStorage.setItem("token", response.token);
          setIsLoggedIn(true);
          navigate("/products");
        } else {
          setError("Phản hồi không chứa token. Kiểm tra lại API backend.");
        }
      } catch (err) {
        console.error("Đăng nhập thất bại:", err);
        setError("Sai tên đăng nhập hoặc mật khẩu, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const logUsername = validateUsername(formData.username);
    const logPassword = validatePassword(formData.password);
    if (logUsername) newErrors.username = logUsername;
    if (logPassword) newErrors.password = logPassword;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="login-form">
      <div className="form-content">
        <h1>Xin chào!</h1>
        <p className="subtitle">
          Bạn chưa có tài khoản?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister();
            }}
          >
            Đăng ký ngay
          </a>
        </p>

        {error && (
          <div className="error-alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.username && <Message text={errors.username} />}
          </div>

          <div className="form-group">
            <div className="password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <Icon>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </Icon>
                ) : (
                  <Icon>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  </Icon>
                )}
              </button>
            </div>
            {errors.password && <Message text={errors.password} />}
          </div>

          <div className="form-options">
            <a href="#" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Đang đăng nhập ..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
