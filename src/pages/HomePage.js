import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/back_white.jpeg';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <img src={logo} alt="AQUADATA Logo" className="logo" />
      <h1></h1>
      <Link to="/login" className="btn-enter">Entrar</Link>
      <footer>
        <p>Versão 1.0 | © 2024 AQUADATA</p>
      </footer>
    </div>
  );
};

export default HomePage;
