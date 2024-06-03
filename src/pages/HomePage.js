import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/back_white.jpeg';
import '../styles/HomePage.css';

const HomePage = () => {
  const [showButton, setShowButton] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      const formData = JSON.parse(localStorage.getItem('formData'));
      if (formData && formData.saveLogin) {
        setFadeClass('fade-out'); // Inicia a animação de fade out
        setTimeout(() => {
          navigate('/dashboard');
        }, 500); // Tempo para a animação de fade out
      } else {
        setShowButton(true);
      }
    }, 2000); // Aguardar 2 segundos

    return () => {
      clearTimeout(timer1);
    };
  }, [navigate]);

  return (
     <div className={`home-page ${fadeClass}`}>
      <div className="content">
        <img src={logo} alt="AQUADATA Logo" className="logo" />
        <h1></h1>
        {showButton && <Link to="/login" className="btn-enter">Entrar</Link>}
      </div>
      <footer>
        <p>Versão 1.0 | © 2024 AQUADATA</p>
      </footer>
    </div>
  );
};

export default HomePage;
