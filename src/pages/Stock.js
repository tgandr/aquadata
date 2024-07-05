import React, { useState, useEffect } from 'react';
import { parsePath, useNavigate } from 'react-router-dom';
import '../styles/Stock.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faBoxesPacking, faBacteria, faBoxesStacked, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from './utils';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { IconContainer } from './utils';

const Stock = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState({ ration: false, probiotics: false, fertilizers: false, others: false });
  const formData = JSON.parse(localStorage.getItem('formData'));
  const [showTotalValue, setShowTotalValue] = useState(false);
  const headers = [['Data', 'dataCompra'], ['Fornecedor', 'fornecedor'], ['Quantidade', 'quantidade']]

  const [stockData, setStockData] = useState({
    feedPurchase: [],
    probioticsPurchase: [],
    fertilizersPurchase: [],
    othersPurchase: []
  });

  const calculateTotalValue = (purchaseData) => {
    
    const totalFeedPurchases = stockData.feedPurchase.reduce((total, i) => 
      total + (parseFloat(i.quantidade) * (parseFloat(i.preco)/parseInt(i.tamanhoSaco))), 0);
    return purchaseData.reduce((total, item) => {
      return total + (parseFloat(item.quantidade) * parseFloat(item.preco));
    }, totalFeedPurchases);
  };

  const totalValue = calculateTotalValue(
    (stockData.othersPurchase ?? [])
      .concat(stockData.probioticsPurchase ?? [], 
        stockData.fertilizersPurchase ?? [])
  );

  useEffect(() => {
    const storedStockData = JSON.parse(localStorage.getItem('stockData'));
    if (storedStockData) {
      setStockData(storedStockData);
    }
    if (totalValue !== 0) {
      setShowTotalValue(true);
    }
  }, [totalValue]);

  const renderTable = (data = [], headers) => {
    if (!data.length) {
      return <p>Aguardando anotação de compras</p>;
    }
    return (
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header[0]}>{header[0]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          
          {data.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{(item[header[1]])}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
        {showTotalValue && (
          <h4>Valor Total em Estoque: R$ {(totalValue).toLocaleString('pt-BR',
            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
        )}
      
      </div>
      <IconContainer />

      {showPopup.ration && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Ração</h3>
            {renderTable(stockData.feedPurchase, headers)}
            <button onClick={() => setShowPopup({ ...showPopup, ration: false })}>Voltar</button>
          </div>
        </div>
      )}

      {showPopup.probiotics && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Probióticos</h3>
            {renderTable(stockData.probioticsPurchase, headers)}
            <button onClick={() => setShowPopup({ ...showPopup, probiotics: false })}>Voltar</button>
          </div>
        </div>
      )}

      {showPopup.fertilizers && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Fertilizantes</h3>
            {renderTable(stockData.fertilizersPurchase, headers)}
            <button onClick={() => setShowPopup({ ...showPopup, fertilizers: false })}>Voltar</button>
          </div>
        </div>
      )}

      {showPopup.others && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Outros</h3>
            {renderTable(stockData.othersPurchase, headers)}
            <button onClick={() => setShowPopup({ ...showPopup, others: false })}>Voltar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
