import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainFrame.css';

const MainFrame = () => {
  const [viveiros, setViveiros] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    numeroViveiro: '',
    dataEstocagem: '',
    origemPL: '',
    quantidadeEstocada: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoViveiro = {
      id: viveiros.length + 1,
      nome: `Viveiro ${form.numeroViveiro}`,
      dataEstocagem: form.dataEstocagem,
      origemPL: form.origemPL,
      quantidadeEstocada: form.quantidadeEstocada
    };
    setViveiros([...viveiros, novoViveiro]);
    setShowPopup(false);
    setForm({
      numeroViveiro: '',
      dataEstocagem: '',
      origemPL: '',
      quantidadeEstocada: ''
    });
  };

  return (
    <div className="main-frame">
      <h2>Lista de Viveiros</h2>
      <div className="viveiros-container">
        <button className="adicionar-button" onClick={() => setShowPopup(true)}>Adicionar Viveiro</button>
        {viveiros.map(viveiro => (
          <Link to={`/viveiro-${viveiro.id}`} key={viveiro.id}>
            <button className="viveiro-button">
              <span className="viveiro-titulo">{viveiro.nome}</span>
              <span className="viveiro-data">{viveiro.dataEstocagem}</span>
            </button>
          </Link>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Adicionar Viveiro</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Número do Viveiro:
                <input
                  type="text"
                  name="numeroViveiro"
                  value={form.numeroViveiro}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Data de Estocagem:
                <input
                  type="date"
                  name="dataEstocagem"
                  value={form.dataEstocagem}
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
                  min="1"
                />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopup(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainFrame;
