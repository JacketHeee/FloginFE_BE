
import { useState } from 'react';
import AuthSlider from '../../components/AuthSlider/AuthSlider';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import './Register.scss';

const Register = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

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
              onLoginSuccess={onLoginSuccess}
            />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
