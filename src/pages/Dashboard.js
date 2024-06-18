import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faWarehouse, faDollarSign, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const formData = JSON.parse(localStorage.getItem('formData'));

  useEffect(() => {
    if (formData.eraseLocalStorageAfterLogout) {
      console.log(formData.eraseLocalStorageAfterLogout)
      const handleUnload = () => {
        localStorage.clear();
      };
  
      window.addEventListener('beforeunload', handleUnload);
  
      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
  }, []);


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
      <div className="identify-data">
        <h2>Fazenda {formData.nomeFazenda}</h2>
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
            <FontAwesomeIcon icon={faWarehouse} className="icon" />
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
        <a href="https://www.instagram.com/data.aqua" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <FontAwesomeIcon icon={faInstagram} /><span> data.aqua</span>
        </a>
      </div>
      <div className="icon-container">
        <div className="icon-container-inner">
          <img src={aquaDataIcon} alt="Aqua Data Icon" className="centered-image" />
        </div>
      </div>

    </div>

  );
};

export default Dashboard;
