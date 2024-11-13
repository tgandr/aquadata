// src/pages/ConfirmationPage.js
import React from 'react';
import { Link } from 'react-router-dom';
// import './ConfirmationPage.css';

const ConfirmationPage = () => {
  return (
    <div className="confirmation-page">
      <h2>Cadastro Realizado</h2>
      <p>Seu cadastro foi realizado com sucesso!</p>
      <Link to="/viveiros" className="btn-continue">Continuar</Link>
    </div>
  );
};

export default ConfirmationPage;
