import React from 'react';
import { useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faBox, faMoneyBill, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
      formData.saveLogin = false;
      localStorage.setItem('formData', JSON.stringify(formData));
    }
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Início</h2>
      <div className="btn-container">
        <button onClick={() => navigate('/viveiros')}>
          <FontAwesomeIcon icon={faShrimp} /> Produção
        </button>
        <button onClick={() => navigate('/estoque')}>
          <FontAwesomeIcon icon={faBox} /> Controle de Estoque
        </button>
        <button onClick={() => navigate('/financeiro')}>
          <FontAwesomeIcon icon={faMoneyBill} /> Financeiro
        </button>
        <button onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Sair da Conta
        </button>
      </ div>
      <div className="icon-container">
        <img src={aquaDataIcon} alt="Aqua Data Icon" style={{ width: '100px', height: '100px' }} />
      </div>
    </div>
  );
};

export default Dashboard;
