import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PondDetail.css';

const PondDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viveiroId = location.state.id;

  const [cultivo, setCultivo] = useState(null);
  const [showPopupNewCycle, setshowPopupNewCycle] = useState(false);
  const [showPopupFeed, setShowPopupFeed] = useState(false); // Novo estado para o pop-up de "Anotações de Arraçoamento"
  const [form, setForm] = useState({
    dataPovoamento: '',
    origemPL: '',
    quantidadeEstocada: '',
    testeEstresse: false
  });
  const [formFeed, setFormFeed] = useState({
    data: new Date().toISOString().split('T')[0], // Preenche automaticamente a data atual
    racaoTotalDia: '',
    quantidadeTratos: '',
    observacao1: false,
    observacao2: false,
    observacao3: false
  });

  useEffect(() => {
    const storedCultivo = JSON.parse(localStorage.getItem(`cultivo-${viveiroId}`));
    if (storedCultivo) {
      setCultivo(storedCultivo);
    }
  }, [viveiroId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'observacoes') {
      setFormFeed({ ...formFeed, [value]: checked });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCultivo = {
      ...form,
      dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0] // Formata a data
    };
    localStorage.setItem(`cultivo-${viveiroId}`, JSON.stringify(newCultivo));
    setCultivo(newCultivo);
    setshowPopupNewCycle(false);
  };

  const handleFeedSubmit = (e) => {
    e.preventDefault();
    // Salvando as anotações de arraçoamento
    console.log(formFeed);
    setShowPopupFeed(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleBackClick = () => {
    navigate('/viveiros');
  };

  const handleStressTestClick = (value) => {
    setForm({ ...form, testeEstresse: value });
  };

  return (
    <div className="pond-detail">
      <h2>Detalhes do Viveiro {viveiroId}</h2>
      {cultivo ? (
        <div>
          <h3>Cultivo em Curso</h3>
          <p>Data de Povoamento: {formatDate(cultivo.dataPovoamento)}</p>
          <p>Origem da PL: {cultivo.origemPL}</p>
          <p>Quantidade Estocada: {cultivo.quantidadeEstocada}</p>
          <p>Teste de Estresse: {cultivo.testeEstresse ? 'Realizado' : 'Não Realizado'}</p>
          <div className="buttons-container">
            <button className="pond-button" onClick={() => setShowPopupFeed(true)}>Anotações de<br />Arraçoamento</button>
            <button className="pond-button">Parâmetros<br />da Água</button>
            <button className="pond-button">Análise<br />Presuntiva</button>
            <button className="pond-button">Anotar<br />biometria</button>
            <button className="pond-button">Dados de <br />despesca</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>O viveiro está vazio</h3>
          <button onClick={() => setshowPopupNewCycle(true)}>Novo Ciclo de Cultivo</button>
        </div>
      )}

      {showPopupNewCycle && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Novo Ciclo de Cultivo</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Data de Povoamento:
                <input
                  type="date"
                  name="dataPovoamento"
                  value={form.dataPovoamento}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Origem da PL:
                <input
                  type="text"
                  name="origemPL"
                  value={form.origemPL}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Quantidade Estocada:
                <input
                  type="number"
                  name="quantidadeEstocada"
                  value={form.quantidadeEstocada}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Teste de Estresse:
                <div className="stress-test-buttons">
                  <button
                    type="button"
                    className={`stress-test-button ${form.testeEstresse === 'Sim' ? 'active' : ''}`}
                    onClick={() => handleStressTestClick('Sim')}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    className={`stress-test-button ${form.testeEstresse === 'Não' ? 'active' : ''}`}
                    onClick={() => handleStressTestClick('Não')}
                  >
                    Não
                  </button>
                </div>
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setshowPopupNewCycle(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showPopupFeed && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Anotações de Arraçoamento</h3>
            <form onSubmit={handleFeedSubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={formFeed.data}
                  onChange={(e) => setFormFeed({ ...formFeed, data: e.target.value })}
                  required
                />
              </label>
              <label>
                Ração total do dia:
                <input
                  type="text"
                  name="racaoTotalDia"
                  value={formFeed.racaoTotalDia}
                  onChange={(e) => setFormFeed({ ...formFeed, racaoTotalDia: e.target.value })}
                  required
                />
              </label>
              <label>
                Quantidade de tratos:
                <input
                  type="number"
                  name="quantidadeTratos"
                  value={formFeed.quantidadeTratos}
                  onChange={(e) => setFormFeed({ ...formFeed, quantidadeTratos: e.target.value })}
                  required
                />
              </label>
              <div className='obs'>
              <label>
                Observações:
              </label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="observacao1"
                    checked={formFeed.observacao1}
                    onChange={(e) => setFormFeed({ ...formFeed, observacao1: e.target.checked })}
                  />
                  Observação-1
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="observacao2"
                    checked={formFeed.observacao2}
                    onChange={(e) => setFormFeed({ ...formFeed, observacao2: e.target.checked })}
                  />
                  Observação-2
                </label>
              </div>
              </div>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopupFeed(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
      <button onClick={handleBackClick}>Voltar para Viveiros</button>
    </div>
  );
};

export default PondDetail;
