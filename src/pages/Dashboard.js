import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faWarehouse, faDollarSign, faSignOutAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
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

      return () => {
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
  }, []);

  const handleLogoutClick = () => {
    const isConfirmed = window.confirm('Você tem certeza que deseja sair?');
    if (isConfirmed) {
      handleLogout();
    }
  };
  
  const handleLogout = () => {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
      formData.saveLogin = false;
      localStorage.setItem('formData', JSON.stringify(formData));
    }
    navigate('/login');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '5585992612616';
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank');
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
            <span>Viveiros</span>
          </div>
        </button>
        <button className="dashboard-button" onClick={() => navigate('/estoque')}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faWarehouse} className="icon" />
          </div>
          <div className="text-wrapper">
            <span>Estoque</span>
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
        <button className="dashboard-button" onClick={() => navigate('/inventario')}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
          </div>
          <div className="text-wrapper">
            <span>Inventário</span>
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
          <button className="side-icon-button" onClick={handleWhatsAppClick}>
            <div>
              <FontAwesomeIcon icon={faWhatsapp} className="icon" />
            </div>
            <span className="side-icon-button-text">Whatsapp</span>
          </button>
          <img
            src={aquaDataIcon}
            alt="Aqua Data Icon"
            style={{ width: '100px', height: '100px' }}
            onClick={() => navigate('/dashboard')}
            className="centered-image"
          />
          <button className="side-icon-button" onClick={handleLogoutClick}>
            <div>
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
            </div>
            <span className="side-icon-button-text">Sair</span>
          </button>
        </div>
      </div>

    </div>

  );
};

export default Dashboard;
