import { useNavigate } from 'react-router-dom'
import AuthSlider from '../../components/AuthSlider/AuthSlider'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import './Register.scss'

const Register = () => {
  const navigate = useNavigate()

  const handleSwitchToLogin = () => {
    navigate('/login')
  }

  const handleRegisterSuccess = () => {
    // Sau khi đăng ký thành công, chuyển sang login
    navigate('/login')
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="left-section">
          <AuthSlider />
        </div>
        <div className="right-section">
          <RegisterForm
            onSwitchToLogin={handleSwitchToLogin}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>
    </div>
  )
}

export default Register
