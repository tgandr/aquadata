import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart, faLightbulb, faTools, faEllipsisH, faChartBar, faUsers,
  faDollarSign, faChartPie
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Financial.css';
import LaborPopup from './LaborPopup';
import Purchases from './Purchases';
import { IconContainer } from './utils';
import { parse } from 'uuid';

const Financial = () => {
  const navigate = useNavigate();
  const formData = JSON.parse(localStorage.getItem('formData'));
  const [showPopup, setShowPopup] = useState(null);
  const [showLaborPopup, setShowLaborPopup] = useState(false);
  const [showPurchasesPopup, setShowPurchasesPopup] = useState(false);
  const [showRevenuePopup, setShowRevenuePopup] = useState(false);
  const [viveiros, setViveiros] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    value: "",
    description: '',
    distribution: 'y', // Estado para distribuir custo igualmente entre os viveiros
    viveiroDistribution: {} // Estado para armazenar as distribuições individuais por viveiro
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

  const handleChange = (e, dist) => {
    const { name, id, value } = e.target;
    if (name === 'distribution') {
      e.target.value === "y"
        ? setForm({ ...form, distribution: 'y' })
        : setForm({ ...form, distribution: 'n' })
    } else if (dist) {

      setForm({
        ...form,
        viveiroDistribution: {
          ...form.viveiroDistribution,
          [id]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
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

  useEffect(() => {
    const vivs = JSON.parse(localStorage.getItem("viveiros")) || [];
    setViveiros(vivs);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalViveiroValue = Object.values(form.viveiroDistribution)
      .reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
    const formValue = parseFloat(form.value.replace(',', '.'));

    if (formValue !== totalViveiroValue && form.distribution === "n") {
      setErrorMessage('O somatório dos valores dos viveiros deve ser igual ao valor total.');
      return;
    }

    let financial = JSON.parse(localStorage.getItem('financial')) || {};
    const newEntry = {
      value: formValue,
      description: form.description,
      distribution: form.distribution,
      viveiroDistribution: form.viveiroDistribution
    };

    if (payments.some(elem => elem.month === form.date)) {
      const updatedPayments = payments.map(element => {
        if (element.month === form.date) {
          return {
            ...element,
            [showPopup]: [...(element[showPopup] || []), newEntry]
          };
        }
        return element;
      });
      setPayments(updatedPayments);
      financial.payments = updatedPayments;
    } else {
      const updatedPayments = [...payments, {
        month: form.date,
        [showPopup]: [newEntry]
      }];
      setPayments(updatedPayments);
      financial.payments = updatedPayments;
    }

    localStorage.setItem('financial', JSON.stringify(financial));
    setForm({
      date: new Date().toISOString().split('T')[0],
      value: '',
      description: '',
      distribution: false,
      viveiroDistribution: {}
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
        <div className="container-title">
          <h3>Relatórios</h3>
        </div>
        <button className="financial-button"
          onClick={() => (navigate('/meses'))}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faChartBar} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Movimento Mensal</span>
          </div>
        </button>
        <button className="financial-button"
          onClick={() => (navigate('/custos'))}>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faChartPie} className="financial-icon" />
          </div>
          <div className="text-financial-wrapper">
            <span>Custos</span>
          </div>
        </button>
        <div className="payments-container">
          <div className="container-title">
            <h3>Lançamentos</h3>
          </div>
          <button className="financial-button payments-button" onClick={() => setShowLaborPopup(true)}>
            <div className="icon-wrapper payments-icon">
              <FontAwesomeIcon icon={faUsers} className="financial-icon" />
            </div>
            <div className="text-financial-wrapper payments-text">
              <span>Despesas com Pessoal</span>
            </div>
          </button>
          <button className="financial-button payments-button" onClick={() => setShowPurchasesPopup(true)}>
            <div className="icon-wrapper payments-icon">
              <FontAwesomeIcon icon={faShoppingCart} className="financial-icon" />
            </div>
            <div className="text-financial-wrapper payments-text">
              <span>Compras de Insumos</span>
            </div>
          </button>
          <button className="financial-button payments-button" onClick={() => handlePopup('energia')}>
            <div className="icon-wrapper payments-icon">
              <FontAwesomeIcon icon={faLightbulb} className="financial-icon" />
            </div>
            <div className="text-financial-wrapper payments-text">
              <span>Energia Elétrica</span>
            </div>
          </button>
          <button className="financial-button payments-button" onClick={() => handlePopup('servicos')}>
            <div className="icon-wrapper payments-icon">
              <FontAwesomeIcon icon={faTools} className="financial-icon" />
            </div>
            <div className="text-financial-wrapper payments-text">
              <span>Serviços</span>
            </div>
          </button>
          <button className="financial-button payments-button" onClick={() => handlePopup('outros')}>
            <div className="icon-wrapper payments-icon">
              <FontAwesomeIcon icon={faEllipsisH} className="financial-icon" />
            </div>
            <div className="text-financial-wrapper payments-text">
              <span>Outras despesas</span>
            </div>
          </button>
          {/* <button className="financial-button revenue-button" onClick={() => setShowRevenuePopup(true)}>
            <div className="icon-wrapper revenue-icon">
              <FontAwesomeIcon icon={faDollarSign} className="financial-icon" />
            </div>
            <div className="text-financial-wrapper revenue-text">
              <span>Receitas</span>
            </div>
          </button> */}
        </div>
      </div>
      <IconContainer />

      {showLaborPopup && <LaborPopup setShowLaborPopup={setShowLaborPopup} />}

      {showPurchasesPopup && <Purchases setShowPurchasesPopup={setShowPurchasesPopup} />}

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Lançamento de {showPopup === 'servicos' ? `serviços` : showPopup}</h3>
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
                  type="text"
                  name="value"
                  placeholder="0,00"
                  step="0.01"
                  // value={(parseFloat(form.value) / 100).toLocaleString("pt-BR",  { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  value={form.value}
                  onChange={handleChange}
                  required />
              </label>

              {showPopup !== 'energia' &&
                <>
                  <label>Descrição:
                    <textarea
                      name="description"
                      rows="4"
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </label>

                  Distribuir custo igualmente entre os viveiros?
                  <div>
                    <label>
                      <input
                        type="radio"
                        id="y"
                        name="distribution"
                        value="y"
                        checked={form.distribution === "y"}
                        onChange={(e) => handleChange(e)}
                      />
                      <span>Sim</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        id="n"
                        name="distribution"
                        value="n"
                        checked={form.distribution === "n"}
                        onChange={(e) => handleChange(e)}
                      />
                      <span>Não</span>
                    </label>
                  </div>
                  <div>
                    {form.distribution === "n" && viveiros.length > 0 && (
                      <>
                        <h4>Distribuição por viveiro:</h4>
                        {viveiros.map((viveiro) => (
                          <label key={viveiro.id}>{viveiro.nome}:
                            <input
                              type="number"
                              name={viveiro.nome}
                              id={viveiro.id}
                              value={form.viveiroDistribution[viveiro.id] || ''}
                              onChange={(e) => handleChange(e, true)}
                            />
                          </label>
                        ))}
                        <p>Total R$ {Object.values(form.viveiroDistribution)
                          .reduce((acc, index) => acc + parseFloat(index), 0) > 0
                          ? Object.values(form.viveiroDistribution)
                            .reduce((acc, index) => acc + parseFloat(index), 0)
                            .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : `0,00`}</p>

                        <div className="bottom-buttons-distribution">
                          <button
                            type="button"
                            className="cancel-button"
                            onClick={handleClosePopup}
                          >Voltar</button>
                          <button
                            type="submit"
                            className="first-class-button"
                          >Lançar</button>
                        </ div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                      </>
                    )}
                  </div>
                </>
              }
              <br /><br /><br />
              {form.distribution !== "n" &&
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
              }
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
