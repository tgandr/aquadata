import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PondDetail.css';

const PondDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viveiroId = location.state.id;

  const [cultivo, setCultivo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    dataPovoamento: '',
    origemPL: '',
    quantidadeEstocada: '',
    testeEstresse: false
  });

  useEffect(() => {
    const storedCultivo = JSON.parse(localStorage.getItem(`cultivo-${viveiroId}`));
    if (storedCultivo) {
      setCultivo(storedCultivo);
    }
  }, [viveiroId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCultivo = {
      ...form,
      dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0] // Formata a data
    };
    localStorage.setItem(`cultivo-${viveiroId}`, JSON.stringify(newCultivo));
    setCultivo(newCultivo);
    setShowPopup(false);
  };

  const handleBackClick = () => {
    navigate('/viveiros');
  };

  return (
    <div className="pond-detail">
      <h2>Detalhes do Viveiro {viveiroId}</h2>
      {cultivo ? (
        <div>
          <h3>Cultivo em Curso</h3>
          <p>Data de Povoamento: {cultivo.dataPovoamento}</p>
          <p>Origem da PL: {cultivo.origemPL}</p>
          <p>Quantidade Estocada: {cultivo.quantidadeEstocada}</p>
          <p>Teste de Estresse: {cultivo.testeEstresse ? 'Realizado' : 'Não Realizado'}</p>
          <div className="buttons-container">
            <button className="pond-button">Anotações de Arraçoamento</button>
            <button className="pond-button">Monitoramento de Parâmetros da Água</button>
            <button className="pond-button">Análise Presuntiva</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>O viveiro está vazio</h3>
          <button onClick={() => setShowPopup(true)}>Novo Ciclo de Cultivo</button>
        </div>
      )}

      {showPopup && (
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
                <div>
                    <label>
                        <input
                        type="radio"
                        name="testeEstresse"
                        value="Sim"
                        checked={form.testeEstresse === 'Sim'}
                        onChange={handleChange}
                        />
                        Sim
                    </label>
                </div>
                <div>
                <label>
                    <input
                        type="radio"
                        name="testeEstresse"
                        value="Não"
                        checked={form.testeEstresse === 'Não'}
                        onChange={handleChange}
                        />
                        Não
                </label>

                </div>
</label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopup(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
      <button onClick={handleBackClick}>Voltar para Add Ponds</button>
    </div>
  );
};

export default PondDetail;
