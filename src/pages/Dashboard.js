import React from 'react';
import { useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faBox, faDollarSign, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import '../styles/Dashboard.css';

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

  const formData = JSON.parse(localStorage.getItem('formData'));

  return (
    <div className="dashboard-container">
      <div className="identify-data">
        <h2>Início</h2>
        <h3>Fazenda {formData.nomeFazenda}</h3>
      </div>
      <div className="btn-container">
        <button className="dashboard-button" onClick={() => navigate('/viveiros')}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faShrimp} className="icon" />
          </div>
          <div className="text-wrapper">
            <span>Produção</span>
          </div>
        </button>
        <button className="dashboard-button" onClick={() => navigate('/estoque')}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faBox} className="icon" />
          </div>
          <div className="text-wrapper">
            <span>Controle de Estoque</span>
          </div>
        </button>
        <button className="dashboard-button" onClick={() => navigate('/financeiro')}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faDollarSign} className="icon" />
          </div>
          <div className="text-wrapper">
            <span>Financeiro</span>
          </div>
        </button>
        <button className="dashboard-button" onClick={handleLogout}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          </div>
          <div className="text-wrapper">
            <span>Sair da Conta</span>
          </div>
        </button>
      </div>
      <div className="medias">
        <FontAwesomeIcon icon={faInstagram} /><span> data.aqua</span>
      </div>
      <div className="icon-container">
        <img src={aquaDataIcon} alt="Aqua Data Icon" />
      </div>

    </div>

  );
};

export default Dashboard;
