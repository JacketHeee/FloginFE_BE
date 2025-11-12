import { useEffect, useState } from "react";
import "./LoginForm.scss";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

const LoginForm = ({ onSwitchToRegister }) => {
  const { logout, setIsLoggedIn} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      console.log("Submitting login:", formData);

      // ✅ gọi API đúng field email, password
      const response = await login(formData.email, formData.password);
      console.log("Đăng nhập thành công:", response);

      if (response?.token) {
        localStorage.setItem("token", response.token);
        setIsLoggedIn(true)
        navigate("/products");
      } else {
        setError("Phản hồi không chứa token. Kiểm tra lại API backend.");
      }
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      setError("Sai email hoặc mật khẩu, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="form-content">
        <Logo />
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="form-options">
            <a href="#" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
