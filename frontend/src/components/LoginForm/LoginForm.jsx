import { useEffect, useState } from 'react';
import './LoginForm.scss';
import { useAuth } from '../../contexts/AuthContext';
import "./LoginForm.scss";
import Logo from "../Logo/Logo";
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';


const LoginForm = ({ onSwitchToRegister }) => {
  const {logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    logout()
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, [])

  const [formData, setFormData] = useState({
    username: 'admin@gmail.com', // Default for testing
    password: 'admin123', // Default for testing
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    console.log("Login submitted:", formData);
    // Handle login logic here
    try {
      const data = await login(formData.email, formData.password);
      console.log("Đăng nhập login thành công!", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        // Navigate to dashboard
        nav("/products")
      } else {
        console.warn("Không tìm thấy token trong response:", data);
      }
    } catch (err) {
      console.error("Đăng nhập thất bại!", err);
      alert("Kiểm tra lại email và password");
    }
    finally {
      setLoading(false)
    }
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
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
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* <div className="demo-accounts">
          <p>Tài khoản demo:</p>
          <small>Admin: admin / admin123</small>
          <small>User: user / user123</small>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;
