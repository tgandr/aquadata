import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faLightbulb, faTools, faEllipsisH, faChartBar, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faShrimp, faWarehouse, faDollarSign, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Financial.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import LaborPopup from './LaborPopup';
import Purchases from './Purchases';

const Financial = () => {
  const navigate = useNavigate();
  const formData = JSON.parse(localStorage.getItem('formData'));
  const [showPopup, setShowPopup] = useState(null);
  const [showLaborPopup, setShowLaborPopup] = useState(false);
  const [showPurchasesPopup, setShowPurchasesPopup] = useState(false);

  const handlePopup = (type) => {
    setShowPopup(type);
  };

  const handleClosePopup = () => {
    setShowPopup(null);
  };

  return (
    <div className="financial-container">
      <div className="identify-data">
        <h2>Financeiro</h2>
        <h3>Fazenda {formData.nomeFazenda}</h3>
      </div>
      <div className="btn-financial-container">
        <button className="financial-button" onClick={() => setShowLaborPopup(true)}>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faUsers} className="financial-icon" />
        </div>
        <div className="text-financial-wrapper">
          <span>Despesas com Pessoal</span>
        </div>
        </button>
        <button className="financial-button" onClick={() => setShowPurchasesPopup(true)}>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faShoppingCart} className="financial-icon" />
        </div>
          <div className="text-financial-wrapper">
            <span>Compras de Insumos</span>
          </div>
        </button>
        <button className="financial-button">
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faLightbulb} className="financial-icon" />
        </div>
          <div className="text-financial-wrapper">
            <span>Energia Elétrica</span>
          </div>
        </button>
        <button className="financial-button" onClick={() => handlePopup('servicos')}>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faTools} className="financial-icon" />
        </div>
          <div className="text-financial-wrapper">
            <span>Serviços</span>
          </div>
        </button>
        <button className="financial-button" onClick={() => handlePopup('outros')}>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faEllipsisH} className="financial-icon" />
        </div>
          <div className="text-financial-wrapper">
            <span>Outros</span>
          </div>
        </button>
        <button className="financial-button">
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faChartBar} className="financial-icon" />
        </div>
          <div className="text-financial-wrapper">
            <span>Relatório Mensal</span>
          </div>
        </button>
      </div>
      <div className="icon-container">
        <div className="icon-container-inner">
          <button className="side-icon-button" onClick={() => navigate('/viveiros')}>
            <div>
              <FontAwesomeIcon icon={faShrimp} className="icon" />
            </div>
          </button>
          <img 
            src={aquaDataIcon}
            alt="Aqua Data Icon"
            onClick={() => navigate('/dashboard')}
            className="centered-image"
          />
          <button className="side-icon-button" onClick={() => navigate('/estoque')}>
            <div>
              <FontAwesomeIcon icon={faWarehouse} className="icon" />
            </div>
          </button>
        </div>
      </div>
      
      {showLaborPopup && <LaborPopup setShowLaborPopup={setShowLaborPopup} />}

      {showPurchasesPopup && <Purchases setShowPurchasesPopup={setShowPurchasesPopup} />}

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Lançamento de {showPopup}</h3>
            <form>
              <label>Mês:</label>
              <input type="month" name="month" required />
              <label>Valor:</label>
              <input type="number" name="value" step="0.01" required />
              <label>Descrição:</label>
              <textarea name="description" rows="4" required></textarea>
              <div className="button-group">
                <button type="button" onClick={handleClosePopup}>Voltar</button>
                <button type="submit">Lançar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;
