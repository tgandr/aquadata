import React, { useState, useEffect } from 'react';
import { Link, useFetcher, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyringe, faHistory, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddPonds.css';
import SanityAnalysis from './SanityAnalysis';
import AnalysisReport from './AnalysisReport';
import { IconContainer } from './utils';
import LocalDb from '../databases/local.db'
import useDatabase from '../hooks/useDatabase'
import { v4 } from 'uuid';

const AddPonds = () => {
  const db = useDatabase()
  const [ponds, setPonds] = useState([]);
  const [formData, setFormData] = useState('')
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViveirosPopup, setShowViveirosPopup] = useState(false);
  const [selectedPond, setselectedPond] = useState(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [showAnalysisPopupPrevious, setShowAnalysisPopupPrevious] = useState({ start: false, previous: false });
  const [form, setForm] = useState({
    numeroViveiro: '',
    area: ''
  });
  const [cultivos, setCultivos] = useState();

  useEffect(() => {
    LocalDb.get('user').then((user) => {
      setFormData(user)
    }) 
  }, [])

  useEffect(() => {
    if (db) {
      db.find({
        selector: {
          dataType: 'pond'
        }
      }).then(data => {
        setPonds(data.docs)
      })

      db.find({
        selector: {dataType: 'cultivation'}
      }).then(data => {
        setCultivos(data.docs)
      })
    }
  },[db])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPond) {
      const currentUpdatedPond = { ...selectedPond, nome: `Viveiro ${form.numeroViveiro}`, area: form.area }
      const updatedPonds = ponds.map((viveiro) =>
        viveiro._id === selectedPond._id ? currentUpdatedPond : viveiro
      );

      db.put(currentUpdatedPond).then(res => {
        currentUpdatedPond._rev = res.rev
        setPonds(updatedPonds);
      })
    } 
    else {
      // try {
        // const newPond = new PostPondUseCase(
        //   `Viveiro ${form.numeroViveiro}`, 
        //   parseFloat(form.area), 
        //   userId
        // )
        const novoViveiro = {
          _id: v4(),
          nome: `Viveiro ${form.numeroViveiro}`,
          dataType: 'pond',
          area: parseFloat(form.area),
        };
        const updatedViveiros = [...ponds, novoViveiro];
        db.put(novoViveiro)
        setPonds(updatedViveiros);
      // } catch {}
    }
    setShowPopup(false);
    setShowEditPopup(false);
    setselectedPond(null);
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

  const deletePond = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este viveiro?');

    if (confirmDelete) {
        // await deactivatePond(selectedPond._id)
        // const viveiros = JSON.parse(localStorage.getItem('viveiros'));
        const newList = ponds.filter(viv => viv._id !== selectedPond._id);
        // localStorage.setItem('viveiros', JSON.stringify(newList));
        db.remove(selectedPond)
        setPonds(newList);
        setselectedPond(null);
        setShowEditPopup(false);
        setForm({
          numeroViveiro: '',
          area: ''
      });
        alert('Viveiro excluído com sucesso!');
    }

    else {
      alert('Exclusão cancelada.');
    }
  };

  const handleEditClick = (viveiro) => {
    setselectedPond(viveiro);
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
        {ponds.length > 0 ? (
          ponds.map(viveiro => (
            <Link
              to={`/viveiro/${viveiro._id}`}
              state={{ viveiro: viveiro, farmName: formData.nomeFazenda }}
              key={viveiro._id}
              className="link-style">
              <button className="viveiro-button">
                <div className="infos-wrapper">

                  {days(viveiro._id) ? (
                    <span className="viveiro-data"><strong>
                      {days(viveiro._id) === 1 ? '1 dia' : `${days(viveiro._id)} dias`}
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
              {ponds.length > 0 ? (
                ponds.map(viveiro => (
                  <button
                    key={viveiro._id}
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
