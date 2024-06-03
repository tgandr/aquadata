import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/back_white.jpeg';
import '../styles/HomePage.css';
import { CSSTransition } from 'react-transition-group';
import '../styles/Transitions.css'; // Você precisará criar este arquivo

const HomePage = () => {
  const [inProp, setInProp] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setInProp(true); // Inicia a animação de fade in

    const timer = setTimeout(() => {
      const formData = JSON.parse(localStorage.getItem('formData'));
      if (formData && formData.saveLogin) {
        setInProp(false); // Inicia a animação de fade out
        setTimeout(() => {
          navigate('/dashboard');
        }, 500); // Tempo para a animação de fade out
      } else {
        setShowButton(true);
      }
    }, 2000); // Aguardar 2 segundos

    return () => clearTimeout(timer); // Limpar o timer se o componente desmontar
  }, [navigate]);

  return (
    <CSSTransition in={inProp} timeout={500} classNames="fade" unmountOnExit>
      <div className="home-page">
        <div className="content">
          <img src={logo} alt="AQUADATA Logo" className="logo" />
          <h1></h1>
          <div className="show-button">
            {showButton && <Link to="/login" className="btn-enter">Entrar</Link>}
          </div>
        </div>
        <footer>
          <p>Versão 1.0 | © 2024 AQUADATA</p>
        </footer>
      </div>
    </CSSTransition>
  );
};

export default HomePage;
