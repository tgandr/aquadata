import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AddPonds.css';

const AddPonds = () => {
  const [viveiros, setViveiros] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    numeroViveiro: '',
    area: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoViveiro = {
      id: viveiros.length + 1,
      nome: `Viveiro ${form.numeroViveiro}`,
      area: form.area,
    };
    setViveiros([...viveiros, novoViveiro]);
    setShowPopup(false);
    setForm({
      numeroViveiro: '',
      area: ''
    });
  };

  return (
    <div className="add-ponds">
      <h2>Lista de Viveiros</h2>
      <div className="viveiros-container">
        <button className="adicionar-button" onClick={() => setShowPopup(true)}>Adicionar Viveiro</button>
        {viveiros.map(viveiro => (
          <Link to={`/viveiro-${viveiro.id}`} key={viveiro.id}>
            <button className="viveiro-button">
              <span className="viveiro-titulo">{viveiro.nome}</span>
              <span className="viveiro-data">{viveiro.area} ha</span>
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
                Área do viveiro:
                <input
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d+(\.\d{0,1})?$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  required
                  step="0.1"
                  min="0"
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

export default AddPonds;
