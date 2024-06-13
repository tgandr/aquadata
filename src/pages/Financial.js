import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faShoppingCart, faLightbulb, faTools, faEllipsisH, faChartBar } from '@fortawesome/free-solid-svg-icons';
import '../styles/Financial.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import LaborPopup from './LaborPopup';

const Financial = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(null);
  const [showLaborPopup, setShowLaborPopup] = useState(false);
  const [workersList, setWorkersList] = useState([]);
  const [laborTotalByMonth, setLaborTotalByMonth] = useState([]);
  const [laborMonth, setLaborMonth] = useState({
    month: '',
    total: '',
    setWorkers: []
  })

  const handlePopup = (type) => {
    setShowPopup(type);
  };

  const handleClosePopup = () => {
    setShowPopup(null);
  };

  return (
    <div className="financial-container">
      <div className="header">
        <h2>Financeiro</h2>
      </div>
      <div className="btn-financial-container">
        <button className="financial-button" onClick={() => setShowLaborPopup(true)}>
          <FontAwesomeIcon icon={faFileInvoiceDollar} className="financial-icon" />
          <span>Despesas com Pessoal</span>
        </button>
        <button className="financial-button" onClick={() => handlePopup('insumos')}>
          <FontAwesomeIcon icon={faShoppingCart} className="financial-icon" />
          <span>Compras de Insumos</span>
        </button>
        <button className="financial-button" onClick={() => handlePopup('energia')}>
          <FontAwesomeIcon icon={faLightbulb} className="financial-icon" />
          <span>Energia Elétrica</span>
        </button>
        <button className="financial-button" onClick={() => handlePopup('servicos')}>
          <FontAwesomeIcon icon={faTools} className="financial-icon" />
          <span>Serviços</span>
        </button>
        <button className="financial-button" onClick={() => handlePopup('outros')}>
          <FontAwesomeIcon icon={faEllipsisH} className="financial-icon" />
          <span>Outros</span>
        </button>
        <button className="financial-button">
          <FontAwesomeIcon icon={faChartBar} className="financial-icon" />
          <span>Relatório Mensal</span>
        </button>
      </div>
      <div>
          <img 
            src={aquaDataIcon}
            alt="Aqua Data Icon"
            style={{ width: '100px', height: '100px' }}
            onClick={() => navigate('/dashboard')}
            />
        </div>
      
      {showLaborPopup && <LaborPopup 
        setShowLaborPopup={setShowLaborPopup}
        workersList={workersList}
        setWorkersList={setWorkersList}
        setLaborTotalByMonth={setLaborTotalByMonth}
        setLaborMonth={setLaborMonth}
        />
      }

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-button" onClick={handleClosePopup}>X</button>
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
