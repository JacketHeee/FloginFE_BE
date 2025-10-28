import { useState } from 'react';
import './LoginForm.scss';
import Logo from '../Logo/Logo';

const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // Handle login logic here
    // Navigate to dashboard
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <Logo isFull={true}/>
      </div>

      <div className="form-content">
        <h1>Chào mừng quay lại</h1>
        <p className="subtitle">
          Bạn chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>Đăng ký ngay</a>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="form-options">
            {/* <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span></span>
            </label> */}
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="submit-button">
            Đăng nhập
          </button>
        </form>

        {/* <div className="social-login">
          <p>Or log in with</p>
          <div className="social-buttons">
            <button className="social-button google">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Google
            </button>
            <button className="social-button apple">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <path d="M14.94 13.09c-.34.73-.5 1.05-.93 1.7-.6.9-1.44 2.02-2.48 2.03-.93.01-1.18-.59-2.45-.59-1.27 0-1.57.58-2.56.6-1.03.02-1.95-1.25-2.55-2.15-1.73-2.52-1.91-5.48-.84-7.05.76-1.12 1.97-1.78 3.1-1.78 1.15 0 1.88.6 2.83.6.91 0 1.47-.6 2.78-.6 1 0 2.07.54 2.83 1.48-2.49 1.37-2.08 4.93.27 5.76zm-3.1-10.91c.48-.62.86-1.48.72-2.36-.78.04-1.68.53-2.21 1.16-.47.56-.87 1.45-.72 2.29.85.02 1.73-.47 2.21-1.09z"/>
              </svg>
              Apple
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;
