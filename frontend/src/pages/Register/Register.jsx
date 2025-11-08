
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AuthSlider from '../../components/AuthSlider/AuthSlider'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import LoginForm from '../../components/LoginForm/LoginForm'
import './Register.scss'

const Register = () => {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLoginSuccess = () => {
    // Sử dụng auth context thay vì localStorage trực tiếp
    login({ email: 'user@example.com' }) // Mock user data
    navigate('/products')
  }

  const handleRegisterSuccess = () => {
    // Sau khi đăng ký thành công, chuyển sang login
    setIsLogin(true)
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="left-section">
          <AuthSlider />
        </div>
        <div className="right-section">
          {isLogin ? (
            <LoginForm
              onSwitchToRegister={() => setIsLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={() => setIsLogin(true)}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Register
