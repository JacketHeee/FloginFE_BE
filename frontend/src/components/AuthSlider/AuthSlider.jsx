import { useState, useEffect } from 'react';
import './AuthSlider.scss';
import Logo from '../Logo/Logo';

const AuthSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
  {
    title: "Ghi lại khoảnh khắc,",
    subtitle: "Tạo nên ký ức"
  },
  {
    title: "Chào mừng đến với",
    subtitle: "Nền tảng của chúng tôi"
  },
  {
    title: "Hãy tham gia cùng chúng tôi",
    subtitle: "Ngay hôm nay"
  }
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="auth-slider">
      <div className="slider-content">        
        <div className="slider-text">
          <h1>{slides[currentSlide].title}</h1>
          <h1>{slides[currentSlide].subtitle}</h1>
        </div>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
