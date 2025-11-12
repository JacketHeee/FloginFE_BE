import { useNavigate } from 'react-router-dom'
import AuthSlider from '../../components/AuthSlider/AuthSlider'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import './Register.scss'

const Register = () => {
  const navigate = useNavigate()

  const handleSwitchToLogin = () => {
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
          />
        </div>
      </div>
    </div>
  )
}

export default Register
