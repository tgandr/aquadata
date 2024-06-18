import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Stock.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faDollarSign, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Stock = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState({ ration: false, probiotics: false, fertilizers: false, others: false });
  const [showRationOptions, setShowRationOptions] = useState(false);
  const formData = JSON.parse(localStorage.getItem('formData'));

  const [stockData, setStockData] = useState({
    ration: [],
    probiotics: [],
    fertilizers: [],
    others: []
  });
  
  const [formProbiotics, setFormProbiotics] = useState({
    dataCompra: '',
    fornecedor: '',
    quantidade: '',
    preco: ''
  });

  const [formFertilizer, setFormFertilizer] = useState({
    dataCompra: '',
    fertilizante: '',
    quantidade: '',
    valor: ''
  });

  const [formOthers, setFormOthers] = useState({
    dataCompra: '',
    item: '',
    quantidade: '',
    unidade: ''
  });

  useEffect(() => {
    const storedStockData = JSON.parse(localStorage.getItem('stockData')) || {};
    if (storedStockData) {
      setStockData(storedStockData);
    }
  }, []);

  const saveStockDataToLocalStorage = (data) => {
    localStorage.setItem('stockData', JSON.stringify(data));
  };


  const handleChange = (e, formSetter, form) => {
    formSetter({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e, form, formSetter, category) => {
    e.preventDefault();
    const updatedStockData = { ...stockData, [category]: [...stockData[category], form] };
    setStockData(updatedStockData);
    saveStockDataToLocalStorage(updatedStockData);
    setShowPopup({ ration: false, probiotics: false, fertilizers: false, others: false });
    switchRationScreen(true, true);
    formSetter({
      dataCompra: '',
      marcaRacao: '',
      tipoRacao: '',
      quantidadeSacos: '',
      tamanhoSaco: '',
      dataValidade: '',
      precoSaco: '',
      fornecedor: '',
      quantidade: '',
      preco: '',
      fertilizante: '',
      quantidade: '',
      valor: '',
      item: '',
      unidade: ''
    });
  };

  const switchRationScreen = (checkOne, checkTwo) => {
    setShowPopup({...showPopup, ration: checkOne});
    setShowRationOptions(checkTwo)
  }

  return (
    <div className="stock-container">
      <div className="identify-data">
        <h2>Controle de Estoque</h2>
        <h3>Fazenda {formData.nomeFazenda}</h3>
      </div>
      <div className="btn-container">
        <button onClick={() => setShowPopup({ ...showPopup, ration: true })}>Ração</button>
        <button onClick={() => setShowPopup({ ...showPopup, probiotics: true })}>Probióticos</button>
        <button onClick={() => setShowPopup({ ...showPopup, fertilizers: true })}>Fertilizantes</button>
        <button onClick={() => setShowPopup({ ...showPopup, others: true })}>Outros</button>
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
          <button className="side-icon-button" onClick={() => navigate('/financeiro')}>
            <div>
              <FontAwesomeIcon icon={faDollarSign} className="icon" />
            </div>
          </button>
        </div>
      </div>

      {showPopup.ration && !showRationOptions && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Ração</h3>
            <button onClick={() => switchRationScreen(true, true)}>Visualizar Estoque</button>
            {/* <button onClick={() => switchRationScreen(false, true)}>Lançar Compra</button> */}
            <button onClick={() => setShowPopup({ ...showPopup, ration: false })}>Voltar</button>
          </div>
        </div>
      )}

      {showPopup.ration && showRationOptions && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Estoque de Ração</h3>
            {/* {stockData.ration.length > 0 ? (
              stockData.ration.map((item, index) => (
                <div key={index}>
                  <p>Data de Compra: {item.dataCompra}</p>
                  <p>Marca: {item.marcaRacao}</p>
                  <p>Tipo: {item.tipoRacao}</p>
                  <p>Quantidade de Sacos: {item.quantidadeSacos}</p>
                  <p>Tamanho do Saco: {item.tamanhoSaco}</p>
                  <p>Data de Validade: {item.dataValidade}</p>
                  <p>Preço por Saco: {item.precoSaco}</p>
                  <p>____________</p>
                </div>
              ))
            ) : (
              <div>
                <p>Nenhum estoque registrado.</p>
                <button onClick={() => switchRationScreen(false, true)}>Adicionar Compra</button>
              </div>
            )} */}
            <button onClick={() => switchRationScreen(true, false)}>Voltar</button>
          </div>
        </div>
      )}
      
      {showPopup.probiotics && (
        <div className="popup">
        <div className="popup-inner">
          <h3>Adicionar Probióticos</h3>
          <form onSubmit={(e) => handleSubmit(e, formProbiotics, setFormProbiotics, 'probiotics')}>
              <label>
                Data da Compra:
                <input type="date" name="dataCompra" value={formProbiotics.dataCompra} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required />
              </label>
              <label>
                Fornecedor:
                <select name="fornecedor" value={formProbiotics.fornecedor} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required>
                  <option value="">Selecione</option>
                  <option value="Biotrends">Biotrends</option>
                  <option value="Phibro">Phibro</option>
                  <option value="DB Aqua">DB Aqua</option>
                  <option value="Outro">Outro - Informar</option>
                </select>
              </label>
              <label>
                Quantidade:
                <input type="number" name="quantidade" value={formProbiotics.quantidade} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required />
              </label>
              <label>
                Preço:
                <input type="number" name="preco" value={formProbiotics.preco} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopup({ ...showPopup, probiotics: false })}>Cancelar</button>
            </form>
          </div>
          </div>
      )}

      {showPopup.fertilizers && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Adicionar Fertilizante</h3>
            <form onSubmit={(e) => handleSubmit(e, formFertilizer, setFormFertilizer, 'fertilizers')}>
              <label>
                Data da Compra:
                <input type="date" name="dataCompra" value={formFertilizer.dataCompra} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
              </label>
              <label>
                Fertilizante:
                <input type="text" name="fertilizante" value={formFertilizer.fertilizante} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
              </label>
              <label>
                Quantidade:
                <input type="number" name="quantidade" value={formFertilizer.quantidade} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
              </label>
              <label>
                Valor:
                <input type="number" name="valor" value={formFertilizer.valor} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopup({ ...showPopup, fertilizers: false })}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showPopup.others && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Adicionar Insumo</h3>
            <form onSubmit={(e) => handleSubmit(e, formOthers, setFormOthers, 'others')}>
              <label>
                Data da Compra:
                <input type="date" name="dataCompra" value={formOthers.dataCompra} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required />
              </label>
              <label>
                Item:
                <input type="text" name="item" value={formOthers.item} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required />
              </label>
              <label>
                Quantidade:
                <input type="number" name="quantidade" value={formOthers.quantidade} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required />
              </label>
              <label>
                Unidade:
                <select name="unidade" value={formOthers.unidade} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required>
                  <option value="">Selecione</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="unidade">unidade</option>
                </select>
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopup({ ...showPopup, others: false })}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* <div className="stock-data">
        <h3>Dados do Estoque</h3>
        <div>
          <h4>Ração</h4>
          {stockData.ration.map((item, index) => (
            <div key={index}>
              <p>Data de Compra: {item.dataCompra}</p>
              <p>Marca: {item.marcaRacao}</p>
              <p>Tipo: {item.tipoRacao}</p>
              <p>Quantidade de Sacos: {item.quantidadeSacos}</p>
              <p>Tamanho do Saco: {item.tamanhoSaco}</p>
              <p>Data de Validade: {item.dataValidade}</p>
              <p>Preço por Saco: {item.precoSaco}</p>
            </div>
          ))}
        </div>

        <div>
          <h4>Probióticos</h4>
          {stockData.probiotics.map((item, index) => (
            <div key={index}>
              <p>Data de Compra: {item.dataCompra}</p>
              <p>Fornecedor: {item.fornecedor}</p>
              <p>Quantidade: {item.quantidade}</p>
              <p>Preço: {item.preco}</p>
            </div>
          ))}
        </div>

        <div>
          <h4>Fertilizantes</h4>
          {stockData.fertilizers.map((item, index) => (
            <div key={index}>
              <p>Data de Compra: {item.dataCompra}</p>
              <p>Fertilizante: {item.fertilizante}</p>
              <p>Quantidade: {item.quantidade}</p>
              <p>Valor: {item.valor}</p>
            </div>
          ))}
        </div>

        <div>
          <h4>Outros</h4>
          {stockData.others.map((item, index) => (
            <div key={index}>
              <p>Data de Compra: {item.dataCompra}</p>
              <p>Item: {item.item}</p>
              <p>Quantidade: {item.quantidade}</p>
              <p>Unidade: {item.unidade}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Stock;
