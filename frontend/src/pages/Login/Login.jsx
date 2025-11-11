import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../contexts/AuthContext'
import AuthSlider from '../../components/AuthSlider/AuthSlider'
import LoginForm from '../../components/LoginForm/LoginForm'
import './Login.scss'

const Login = () => {
  const navigate = useNavigate()
//   const { logout, isLoggedIn } = useAuth()

  // Tự động logout khi vào trang login
  useEffect(() => {
    // const performLogout = async () => {
    //   if (isLoggedIn) {
    //     await logout()
    //   }
    // }
    
    // performLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Chỉ chạy 1 lần khi mount

  const handleSwitchToRegister = () => {
    navigate('/register')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-section">
          <AuthSlider />
        </div>
        <div className="right-section">
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        </div>
      </div>
    </div>
  )
}

export default Login
