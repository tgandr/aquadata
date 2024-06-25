import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Stock.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faBoxesPacking, faBacteria, faBoxesStacked, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const Stock = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState({ ration: false, probiotics: false, fertilizers: false, others: false });
  const formData = JSON.parse(localStorage.getItem('formData'));

  const [stockData, setStockData] = useState({
    ration: [],
    probiotics: [],
    fertilizers: [],
    others: []
  });

  useEffect(() => {
    const storedStockData = JSON.parse(localStorage.getItem('stockData')) || {};
    if (storedStockData) {
      setStockData(storedStockData);
    }
  }, []);

  

  return (
    <div className="financial-container">
      <div className="identify-data">
        <h2>Controle de Estoque</h2>
        <h3>Fazenda {formData.nomeFazenda}</h3>
      </div>
      <div className="btn-financial-container">
        <button
          className="financial-button"
          onClick={() => setShowPopup({ ...showPopup, ration: true })}
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faBoxesStacked} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Ração</span>
          </div>
        </button>
      
        <button
          className="financial-button"
          onClick={() => setShowPopup({ ...showPopup, probiotics: true })}
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faBacteria} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Probióticos</span>
          </div>
        </button>
      
        <button
          className="financial-button"
          onClick={() => setShowPopup({ ...showPopup, fertilizers: true })}
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faBoxesPacking} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Fertilizantes</span>
          </div>
        </button>
      
        <button
          className="financial-button"
          onClick={() => setShowPopup({ ...showPopup, others: true })}
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faEllipsisH} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Outros</span>
          </div>
        </button>

      </div>
      <div className="icon-container">
        <div className="icon-container-inner">
          <button className="side-icon-button" onClick={() => navigate('/viveiros')}>
            <div>
              <FontAwesomeIcon icon={faShrimp} className="icon" />
            </div>
            <span className="side-icon-button-text">Viveiros</span>
          </button>
          <img
            src={aquaDataIcon}
            alt="Aqua Data Icon"
            onClick={() => navigate('/dashboard')}
            className="centered-image"
          />
          <button className="side-icon-button" onClick={() => navigate('/financeiro')}>
            <div>
              <FontAwesomeIcon icon={faDollarSign} className="icon" />
            </div>
            <span className="side-icon-button-text">Financeiro</span>
          </button>
        </div>
      </div>

      {showPopup.ration && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Ração</h3>
            <button>Visualizar Estoque</button>
            
            <button onClick={() => setShowPopup({ ...showPopup, ration: false })}>Voltar</button>
          </div>
        </div>
      )}
      
      {showPopup.probiotics && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Ração</h3>
            <button>Visualizar Estoque</button>
            
            <button onClick={() => setShowPopup({ ...showPopup, ration: false })}>Voltar</button>
          </div>
        </div>
      )}

{showPopup.fertilizers && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Ração</h3>
            <button>Visualizar Estoque</button>
            
            <button onClick={() => setShowPopup({ ...showPopup, ration: false })}>Voltar</button>
          </div>
        </div>
      )}

{showPopup.others && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Ração</h3>
            <button>Visualizar Estoque</button>
            
            <button onClick={() => setShowPopup({ ...showPopup, ration: false })}>Voltar</button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Stock;
