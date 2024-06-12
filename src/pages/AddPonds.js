import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AddPonds.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';

const AddPonds = () => {
  const [viveiros, setViveiros] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    numeroViveiro: '',
    area: ''
  });
  const [cultivos, setCultivos] = useState(JSON.parse(localStorage.getItem('history')));

  useEffect(() => {
    const storedViveiros = JSON.parse(localStorage.getItem('viveiros'));
    if (storedViveiros) {
      setViveiros(storedViveiros);
    }
  }, []);

  const saveViveirosToLocalStorage = (viveiros) => {
    localStorage.setItem('viveiros', JSON.stringify(viveiros));
  };

  const formData = JSON.parse(localStorage.getItem('formData'));

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
    const updatedViveiros = [...viveiros, novoViveiro];
    setViveiros(updatedViveiros);
    saveViveirosToLocalStorage(updatedViveiros);
    setShowPopup(false);
    setForm({
      numeroViveiro: '',
      area: ''
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const today = new Date().getTime()
    const dayStart = new Date(dateString).getTime()
    const days = Math.floor((today - dayStart) / 86400000)
    return {
        date: `${day}/${month}/${year}`,
        days: days
    }
  };

  const days = (id) => {
    if (cultivos && cultivos.length > 0) {
      const cultivo = cultivos.find(cultivo => cultivo.viveiroId === id);
      if (cultivo && cultivo.hasShrimp) {
        return formatDate(cultivo.dataPovoamento).days;
      }
    }
  };

  const navigate = useNavigate();

  return (
    <div className="add-ponds">
      <div className="identify-data">
        <h2>Viveiros</h2>
        <h3>Fazenda {formData.nomeFazenda}</h3>
      </div>
      <div className="viveiros-container">
        <button className="adicionar-button" onClick={() => setShowPopup(true)}>Adicionar Viveiro</button>
        {viveiros.length > 0 ? (
          viveiros.map(viveiro => (
            <Link to={`/viveiro/${viveiro.id}`}  state={viveiro} key={viveiro.id} className="link-style">
              <button className="viveiro-button">
                <div className="infos-wrapper">
                  <span className="viveiro-data">{viveiro.area} ha</span>
                  {days(viveiro.id) ? ( 
                    <span className="viveiro-data">
                      {days(viveiro.id) === 1 ? '1 dia de cultivo' : `${days(viveiro.id)} dias de cultivo`}
                    </span>
                  ) : (
                    <span className="viveiro-data">Desocupado</span>
                  )}
                </div>
                <div className="text-add-pond-wrapper">
                  <span className="viveiro-titulo">{viveiro.nome}</span>
                </div>
              </button>
            </Link>
          ))
        ) : (
          <p>Nenhum viveiro cadastrado.</p>
        )}
        {/* <button onClick={() => navigate('/dashboard')} className="voltar-button">Voltar</button> */}
        
      </div>
      <div className="icon-container">
          <img 
            src={aquaDataIcon}
            alt="Aqua Data Icon"
            style={{ width: '100px', height: '100px' }}
            onClick={() => navigate('/dashboard')}
            />
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
                Área do viveiro (em hectares):
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
