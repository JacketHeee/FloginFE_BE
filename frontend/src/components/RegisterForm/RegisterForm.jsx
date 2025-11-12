import { useState } from 'react';
import './RegisterForm.scss';
import Logo from '../Logo/Logo';
import { useNavigate } from 'react-router-dom';
import { register } from "../../services/authService";
import Message from '../Message/Message';
import Icon from '../Icon/Icon';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: 'Nguyễn Hùng',
    lastName: 'Mạnh',
    email: 'jackethee@gmail.com',
    password: 'admin123',
    agreeToTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [error, setError] = useState("");

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      console.log('Form submitted:', formData);
      
      try {
        const data = await register(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password
        );

        console.log("Đăng ký thành công! ", data);
        nav("/login");
      } catch (err) {
        console.error("Đăng ký thất bại", err);
        setError("Tài khoản đã tồn tại")
      } finally {
        setLoading(false);
      }
    }
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!formData.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Vui lòng đồng ý";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="register-form">
      <div className="form-content">
        <h1>Tạo tài khoản</h1>
        <p className="subtitle">
          Bạn đã có tài khoản?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
          >
            Đăng nhập ngay
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
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="Họ và"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.firstName && <Message text={errors.firstName}/>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Tên"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.lastName && <Message text={errors.lastName}/>}
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <Message text={errors.email}/>}
          </div>

          <div className="form-group">
            <div className="password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu của bạn"
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
                {showPassword ? 
                  <Icon>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </Icon>
                  : 
                  <Icon>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  </Icon>
                }
              </button>
            </div>
            {errors.password && <Message text={errors.password}/>}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <span>
                Tôi đồng ý với các <a href="/terms"> Điều khoản & Điều kiện</a>
              </span>
            </label>
              {errors.agreeToTerms && <Message text={errors.agreeToTerms} />}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading? "Đang đăng ký ...": "Đăng ký"}
          </button>
        </form>

        {/* <div className="social-login">
          <p>Or register with</p>
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

export default RegisterForm;
