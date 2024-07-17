import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faLightbulb, faTools, faEllipsisH, faChartBar, faUsers, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import '../styles/Financial.css';
import LaborPopup from './LaborPopup';
import Purchases from './Purchases';
import { IconContainer } from './utils';

const Financial = () => {
  const navigate = useNavigate();
  const formData = JSON.parse(localStorage.getItem('formData'));
  const [showPopup, setShowPopup] = useState(null);
  const [showLaborPopup, setShowLaborPopup] = useState(false);
  const [showPurchasesPopup, setShowPurchasesPopup] = useState(false);
  const [showRevenuePopup, setShowRevenuePopup] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    value: '',
    description: ''
  });
  const [payments, setPayments] = useState([]);
  const [revenues, setRevenues] = useState([]);

  const handlePopup = (type) => {
    setShowPopup(type);
  };

  const handleClosePopup = () => {
    setShowPopup(null);
    setShowRevenuePopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    const financial = JSON.parse(localStorage.getItem('financial')) || {};
    if ('payments' in financial) {
      setPayments(financial.payments);
    } else {
      setPayments([]);
    }
    if ('revenues' in financial) {
      setRevenues(financial.revenues);
    } else {
      setRevenues([]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let financial = JSON.parse(localStorage.getItem('financial')) || {};
    if (payments.some(elem => elem.month === form.date)) {
      const updatedPayments = payments.map(element => {
        if (element.month === form.date) {
          if ([showPopup] in element) {
            const previousInfos = element[showPopup];
            return {
              ...element, [showPopup]: [...previousInfos,
              { value: form.value, description: form.description }]
            };
          }
          return { ...element, [showPopup]: [{ value: form.value, description: form.description }] };
        }
        return element;
      });
      setPayments(updatedPayments);
      financial = { ...financial, payments: updatedPayments };
      localStorage.setItem('financial', JSON.stringify(financial));
    } else {
      const updatedPayments = [...payments, {
        month: form.date, [showPopup]: [{
          value: form.value, description: form.description
        }]
      }];
      setPayments(updatedPayments);
      financial = { ...financial, payments: updatedPayments };
      localStorage.setItem('financial', JSON.stringify(financial));
    }
    setForm({
      date: new Date().toISOString().split('T')[0],
      value: '',
      description: ''
    });
    handleClosePopup();
  };

  const handleRevenueSubmit = (e) => {
    e.preventDefault();
    let financial = JSON.parse(localStorage.getItem('financial')) || {};
    const updatedRevenues = [...revenues, {
      date: form.date,
      value: form.value,
      description: form.description
    }];
    setRevenues(updatedRevenues);
    financial = { ...financial, revenues: updatedRevenues };
    localStorage.setItem('financial', JSON.stringify(financial));
    setForm({
      date: new Date().toISOString().split('T')[0],
      value: '',
      description: ''
    });
    handleClosePopup();
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
        <button className="financial-button" onClick={() => handlePopup('energia')}>
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
        <button className="financial-button" onClick={() => setShowRevenuePopup(true)}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faDollarSign} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Receitas</span>
          </div>
        </button>
        <button className="financial-button"
          onClick={() => (navigate('/meses'))}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faChartBar} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Relatório Mensal</span>
          </div>
        </button>
      </div>
      <IconContainer />

      {showLaborPopup && <LaborPopup setShowLaborPopup={setShowLaborPopup} />}

      {showPurchasesPopup && <Purchases setShowPurchasesPopup={setShowPurchasesPopup} />}

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Lançamento de {showPopup}</h3>
            <form
              className="harv-form"
              onSubmit={(e) => handleSubmit(e)}>
              <label>Data:
                <input
                  type="month"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required />
              </label>
              <label>Valor:
                <input
                  type="number"
                  name="value"
                  step="0.01"
                  value={form.value}
                  onChange={handleChange}
                  required />
              </label>
              {showPopup !== 'energia' &&
                <label>Descrição:
                  <textarea
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                  ></textarea>
                </label>
              }
              <br /><br /><br />
              <div className="bottom-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleClosePopup}
                >Voltar</button>
                <button
                  type="submit"
                  className="first-class-button"
                >Lançar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRevenuePopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Lançamento de Receita</h3>
            <form
              className="harv-form"
              onSubmit={(e) => handleRevenueSubmit(e)}>
              <label>Data:
                <input
                  type="month"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required />
              </label>
              <label>Valor:
                <input
                  type="number"
                  name="value"
                  step="0.01"
                  value={form.value}
                  onChange={handleChange}
                  required />
              </label>
              <label>Descrição:
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </label>
              <br /><br /><br />
              <div className="bottom-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleClosePopup}
                >Voltar</button>
                <button
                  type="submit"
                  className="first-class-button"
                >Lançar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;
