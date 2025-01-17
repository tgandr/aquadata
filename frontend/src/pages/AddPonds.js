import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyringe, faHistory, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddPonds.css';
import SanityAnalysis from './SanityAnalysis';
import AnalysisReport from './AnalysisReport';
import { IconContainer } from './utils';
import { v4 as uuidv4 } from 'uuid';

const AddPonds = () => {
  const [viveiros, setViveiros] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViveirosPopup, setShowViveirosPopup] = useState(false);
  const [selectedViveiro, setSelectedViveiro] = useState(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [showAnalysisPopupPrevious, setShowAnalysisPopupPrevious] = useState({ start: false, previous: false });
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
  }, [selectedViveiro]);

  const saveViveirosToLocalStorage = (viveiros) => {
    localStorage.setItem('viveiros', JSON.stringify(viveiros));
  };

  const formData = JSON.parse(localStorage.getItem('formData'));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedViveiro) {
      const updatedViveiros = viveiros.map((viveiro) =>
        viveiro.id === selectedViveiro.id ? { ...selectedViveiro, nome: `Viveiro ${form.numeroViveiro}`, area: form.area } : viveiro
      );
      setViveiros(updatedViveiros);
      saveViveirosToLocalStorage(updatedViveiros);
    } else {
      const id = uuidv4();
      const novoViveiro = {
        id: id,
        nome: `Viveiro ${form.numeroViveiro}`,
        area: form.area,
      };
      const updatedViveiros = [...viveiros, novoViveiro];
      setViveiros(updatedViveiros);
      saveViveirosToLocalStorage(updatedViveiros);
    }
    setShowPopup(false);
    setShowEditPopup(false);
    setSelectedViveiro(null);
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
      const cultivo = cultivos.find(cultivo => cultivo.hasShrimp && cultivo.viveiroId === id);
      if (cultivo && cultivo.hasShrimp) {
        return formatDate(cultivo.dataPovoamento).days;
      }
    }
  };

  const navigate = useNavigate();

  const deletePond = () => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este viveiro?');

    if (confirmDelete) {
      const viveiros = JSON.parse(localStorage.getItem('viveiros'));
      const newList = viveiros.filter(viv => viv.id !== selectedViveiro.id);
      localStorage.setItem('viveiros', JSON.stringify(newList));
      setViveiros(newList);
      setSelectedViveiro(null);
      setShowEditPopup(false);
      setForm({
        numeroViveiro: '',
        area: ''
      });
      alert('Viveiro excluído com sucesso!');
    } else {
      alert('Exclusão cancelada.');
    }
  };

  const handleEditClick = (viveiro) => {
    setSelectedViveiro(viveiro);
    setForm({
      numeroViveiro: viveiro.nome.split(' ')[1],
      area: viveiro.area
    });
    setShowViveirosPopup(false);
    setShowEditPopup(true);
  };

  return (
    <div className="add-ponds">
      <div className="identify-data">
        <h2>Viveiros</h2>
        <h3>Fazenda {formData.nomeFazenda}</h3>
      </div>
      <div className="viveiros-container">
        {viveiros.length > 0 ? (
          viveiros.map(viveiro => (
            <Link
              to={`/viveiro/${viveiro.id}`}
              state={{ viveiro: viveiro, farmName: formData.nomeFazenda }}
              key={viveiro.id}
              className="link-style">
              <button className="viveiro-button">
                <div className="infos-wrapper">

                  {days(viveiro.id) ? (
                    <span className="viveiro-data"><strong>
                      {days(viveiro.id) === 1 ? '1 dia' : `${days(viveiro.id)} dias`}
                    </strong></span>
                  ) : (
                    <span className="viveiro-data" style={{ color: '#FFFFFF', backgroundColor: '#EA580C' }}>&nbsp;Desocupado&nbsp;</span>
                  )}
                  <span className="viveiro-data">{parseFloat(viveiro.area).toLocaleString('pt-BR', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })} ha</span>
                </div>
                <div className="text-add-pond-wrapper">
                  <span className="viveiro-titulo">{viveiro.nome}</span>
                </div>
              </button>
            </Link>
          ))
        ) : (
          <>
            <h3>Nenhum viveiro cadastrado</h3>
            <br />
          </>
        )}

        <button className="viveiro-button" onClick={() => setShowPopup(true)}>
          <div className="infos-wrapper">
            <FontAwesomeIcon icon={faPlus} className="icon-plus" />
          </div>
          <div className="text-add-pond-wrapper">
            <span className="viveiro-titulo">Adicionar</span>
          </div>
        </button>
        <button className="viveiro-button" onClick={() => setShowViveirosPopup(true)}>
          <div className="infos-wrapper">
            <FontAwesomeIcon icon={faEdit} className="icon-plus" />
          </div>
          <div className="text-add-pond-wrapper">
            <span className="viveiro-titulo">Editar</span>
          </div>
        </button>
        {/* <button className="viveiro-button" onClick={() => setShowViveirosPopup(true)}>
          <div className="infos-wrapper">
            <FontAwesomeIcon icon={faTrash} className="icon-plus" />
          </div>
          <div className="text-add-pond-wrapper">
            <span className="viveiro-titulo">Excluir</span>
          </div>
        </button> */}
        <button className="viveiro-button" onClick={() => setShowAnalysisPopupPrevious({ start: false, previous: true })}>
          <div className="infos-wrapper">
            <FontAwesomeIcon icon={faSyringe} className="icon-plus" />
          </div>
          <div className="text-add-pond-wrapper">
            <span className="viveiro-titulo">Sanidade</span>
          </div>
        </button>
      </div>

      <IconContainer />

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Adicionar Viveiro</h3>
            <form onSubmit={handleSubmit} className="harv-form">
              <label>
                Número do <br />Viveiro:
                <input
                  type="text"
                  name="numeroViveiro"
                  value={form.numeroViveiro}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Área do viveiro <br />(em hectares):
                <input
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                />
              </label>
              <br />
              <br />
              <div className="bottom-buttons">
                <button type="button" onClick={() => setShowPopup(false)} className="cancel-button">Cancelar</button>
                <button type="submit" className="first-class-button">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Editar Viveiro</h3>
            <form onSubmit={handleSubmit} className="harv-form">
              <label>
                Número do <br />Viveiro:
                <input
                  type="text"
                  name="numeroViveiro"
                  value={form.numeroViveiro}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Área do viveiro <br />(em hectares):
                <input
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                />
              </label>
              <label>
                <span>Excluir viveiro?</span>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deletePond()}>
                  <FontAwesomeIcon icon={faTrash} className="icon-plus" style={{ marginRight: '50px' }} />
                </button>

              </label>
              <br />
              <br />
              <div className="bottom-buttons">
                <button type="button" onClick={() => setShowEditPopup(false)} className="cancel-button">Cancelar</button>
                <button type="submit" className="first-class-button">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViveirosPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Selecionar Viveiro para Editar</h3>
            <div className="viveiros-list">
              {viveiros.length > 0 ? (
                viveiros.map(viveiro => (
                  <button
                    key={viveiro.id}
                    onClick={() => handleEditClick(viveiro)}
                  // className="viveiro-button"
                  >
                    {viveiro.nome}
                  </button>
                ))
              ) : (
                <p>Nenhum viveiro cadastrado</p>
              )}
            </div><br />
            <button onClick={() => setShowViveirosPopup(false)} className="cancel-button">Cancelar</button>
          </div>
        </div>
      )}

      {showAnalysisPopupPrevious.previous && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Análise Presuntiva</h3>
            <p>Trata-se do exame minucioso de camarões em busca de sinais que indiquem seu estado de saúde.
              Com a análise presuntiva você poderá ver ameaças antes que seja tarde.
              É necessário um treinamento bem simples e o uso de ferramentas básicas.</p>
            <button
              type="button"
              onClick={() => AnalysisReport(JSON.parse(localStorage.getItem('history')))}
              className="first-class-button">
              Baixar <br />Relatório</button>
            <br />
            <br />
            <br />
            <br />
            <div className="bottom-buttons">
              <button
                type="button"
                onClick={() => setShowAnalysisPopupPrevious({ start: false, previous: false })}
                className="cancel-button">
                Voltar</button>
              <button
                type="button"
                onClick={() => (setShowAnalysisPopup(true), setShowAnalysisPopupPrevious({ start: true, previous: false }))}
                className="first-class-button">
                Realizar Análise Presuntiva
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalysisPopup && (
        <SanityAnalysis
          setShowAnalysisPopup={setShowAnalysisPopup}
          showAnalysisPopupPrevious={showAnalysisPopupPrevious}
          setShowAnalysisPopupPrevious={setShowAnalysisPopupPrevious}
        />)}

    </div>
  );
};

export default AddPonds;
