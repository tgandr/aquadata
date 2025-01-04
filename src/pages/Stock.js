import React, { useState, useEffect } from 'react';
import '../styles/Stock.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesPacking, faBacteria, faBoxesStacked, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from './utils';
import { IconContainer } from './utils';

const Stock = () => {
  const [showPopup, setShowPopup] = useState({ ration: false, probiotics: false, fertilizers: false, others: false });
  const formData = JSON.parse(localStorage.getItem('formData'));
  const [showTotalValue, setShowTotalValue] = useState(false);
  const headers = [['Data', 'date'], ['Fornecedor', 'label'], ['Quantidade', 'quantity']];

  const [stockData, setStockData] = useState({
    feedPurchase: [],
    probioticsPurchase: [],
    fertilizersPurchase: [],
    othersPurchase: []
  });

  const calculateTotalValue = (purchaseData) => {
    if (stockData.feedPurchase) {
      const totalFeedPurchases = stockData.feedPurchase.reduce((total, i) =>
        total + (parseFloat(i.quantity) * (parseFloat(i.value) / parseInt(i.bagSize))), 0);
      return purchaseData.reduce((total, item) => {
        return total + (parseFloat(item.quantity) * parseFloat(item.value));
      }, totalFeedPurchases);
    }
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
      <table className="biometry-table">
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
                <td key={header}>{header[1] === 'date'
                  ? formatDate(item[header[1]]).date
                  : (header[1] === 'quantity' ? (parseFloat(item[header[1]]).toLocaleString()) : (item[header[1]]))}</td>
              ))}
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
        {showTotalValue && totalValue && (
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
