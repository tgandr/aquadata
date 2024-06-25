import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PondDetail.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faWarehouse } from '@fortawesome/free-solid-svg-icons';
// import SanityAnalysis from './SanityAnalysis';
import ParamPopup from './ParamPopup';
import FeedPopup from './FeedPopup';
import NewCyclePopup from './NewCyclePopup';
import BiometryPopup from './BiometryPopup';
import HarvestPopup from './HarvestPopup';
import FertilizationPopup from './FertilizationPopup';

const PondDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viveiroId = location.state.viveiro.id;
  const viveiroName = location.state.viveiro.nome;
  const farmName = location.state.farmName;

  const [cultivo, setCultivo] = useState(null);
  const [showNewCyclePopup, setShowNewCyclePopup] = useState(false);
  const [showStressTestPopup, setShowStressTestPopup] = useState(false);
  const [showCountPlPopup, setShowCountPlPopup] = useState(false);
  const [showCamCountPopup, setShowCamCountPopup] = useState(false);
  const [showFeedPopup, setshowFeedPopup] = useState(false);
  const [showParamPopup, setShowParamPopup] = useState(false);
  // const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [showBiometry, setShowBiometry] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState({ show: false, buttonText: 'Pesagem' });
  const [showPLgrama, setShowPLgrama] = useState(false);
  const [weight, setWeight] = useState(false);
  const [survivalRate, setSurvivalRate] = useState(null);
  const [biometryData, setBiometryData] = useState(null);
  const [newPesagem, setNewPesagem] = useState({ weight: '', count: '' });
  const [biometrics, setBiometrics] = useState(null);
  const [darkPoints, setDarkPoints] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [userCount, setUserCount] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showFertilizationPopup, setShowFertilizationPopup] = useState(false);

  const [form, setForm] = useState({
    dataPovoamento: '',
    origemPL: '',
    quantidadeEstocada: '',
    testeEstresse: false,
    tipoTeste: '',
    alteracaoNatatoria: '',
    larvasMortas: '',
  });

  const [formBiometry, setFormBiometry] = useState({
    data: new Date().toISOString().split('T')[0],
    Pesagem: '',
    Contagem: '',
    pesoMedio: null,
  });

  const [harvestData, setHarvestData] = useState({
    date: new Date().toISOString().split('T')[0],
    despesca: '',
    biomass: '',
    weighings: [{ weight: '', count: '' }],
    comprador: '',
    precoVenda: ''
  });

  useEffect(() => {
    const storedCultivos = JSON.parse(localStorage.getItem(`history`));
    const storedCultivo = storedCultivos && storedCultivos.find((viv) => viv.viveiroId === viveiroId);

    if (storedCultivo) {
      setCultivo(storedCultivo);
      const viveiroData = localStorage.getItem(`cultivo-${storedCultivo.id}`);

      if (viveiroData) {
        const parsedData = JSON.parse(viveiroData);
        if (parsedData.biometrics) {
          setBiometrics(parsedData.biometrics);
        }
      }
    }
  }, [viveiroId]);

  const saveData = (data, key) => {
    const storedCultivos = JSON.parse(localStorage.getItem(`history`));
    const i = storedCultivos && storedCultivos.findIndex((viv) => viv.viveiroId === viveiroId);
    if (key in storedCultivos[i]) {
      const toStore = [...storedCultivos[i][key], data];
      const checkOut = { ...storedCultivos[i], [key]: toStore };
      storedCultivos[i] = checkOut;
      localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
      localStorage.setItem('history', JSON.stringify(storedCultivos));
    } else {
      const checkOut = { ...storedCultivos[i], [key]: [data] };
      storedCultivos[i] = checkOut;
      localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
      localStorage.setItem('history', JSON.stringify(storedCultivos));
    }
  }

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

  const handleBackClick = () => {
    navigate('/viveiros');
  };

  return (
    <div className="pond-detail">
      <div className="identify-data">
        <h2>{viveiroName}</h2>
        <h3>{farmName}</h3>
      </div>
      {cultivo ? (
        <div>
          <div className="infos">
            <p>Povoamento em {formatDate(cultivo.dataPovoamento).date}</p>
            <p>{formatDate(cultivo.dataPovoamento).days} dias de cultivo</p>
            <p>Origem da PL: {cultivo.origemPL}</p>
            <p>Quantidade Estocada: {parseInt(cultivo.quantidadeEstocada).toLocaleString('pt-BR')}</p>
          </ div>
          <div className="buttons-container">
            <button className="pond-button" onClick={() => setshowFeedPopup(true)}>Ração</button>
            <button className="pond-button" onClick={() => setShowParamPopup(true)}>Parâmetros da Água</button>
            {/* <button className="pond-button" onClick={() => setShowAnalysisPopup(true)}>Análise Presuntiva</button> */}
            <button className="pond-button" onClick={() => setShowBiometry(true)}>Biometria</button>
            <button className="pond-button" onClick={() => setShowFertilizationPopup(true)}>Fertilização</button>
            <button className="pond-button" onClick={() => setShowHarvest(true)}>Dados de despesca</button>
            <button className="pond-button">Histórico</button>
            <button className="pond-button">Relatório Parcial</button>
          </div>
        </div>
      ) : (
        <>
          <h3>O viveiro está vazio</h3>
          <button onClick={() => setShowNewCyclePopup(true)}>Novo Ciclo de Cultivo</button>
        </>
      )}

      {showNewCyclePopup && <NewCyclePopup
        showNewCyclePopup={showNewCyclePopup} setShowNewCyclePopup={setShowNewCyclePopup}
        showStressTestPopup={showStressTestPopup} setShowStressTestPopup={setShowStressTestPopup}
        showCountPlPopup={showCountPlPopup} setShowCountPlPopup={setShowCountPlPopup}
        showCamCountPopup={showCamCountPopup} setShowCamCountPopup={setShowCamCountPopup}
        showWeightInput={showWeightInput} setShowWeightInput={setShowWeightInput}
        showPLgrama={showPLgrama} setShowPLgrama={setShowPLgrama}
        darkPoints={darkPoints} setDarkPoints={setDarkPoints}
        threshold={threshold} setThreshold={setThreshold}
        userCount={userCount} setUserCount={setUserCount}
        processedImage={processedImage} setProcessedImage={setProcessedImage}
        capturedImage={capturedImage} setCapturedImage={setCapturedImage}
        weight={weight} setWeight={setWeight}
        showCamera={showCamera} setShowCamera={setShowCamera}
        form={form} setForm={setForm}
        viveiroId={viveiroId}
        setCultivo={setCultivo} />}

      {showFeedPopup && <FeedPopup setshowFeedPopup={setshowFeedPopup} saveData={saveData} />}

      {showParamPopup && <ParamPopup setShowParamPopup={setShowParamPopup} saveData={saveData} />}

      {showBiometry && <BiometryPopup
        viveiroId={viveiroId}
        formBiometry={formBiometry}
        setShowBiometry={setShowBiometry}
        setFormBiometry={setFormBiometry}
        setBiometrics={setBiometrics} />}

      {showHarvest && <HarvestPopup
        cultivo={cultivo}
        saveData={saveData}
        harvestData={harvestData}
        setHarvestData={setHarvestData}
        survivalRate={survivalRate}
        setSurvivalRate={setSurvivalRate}
        biometryData={biometryData}
        setBiometryData={setBiometryData}
        newPesagem={newPesagem}
        setNewPesagem={setNewPesagem}
        showHarvest={showHarvest}
        setShowHarvest={setShowHarvest} />}

      {showFertilizationPopup && <FertilizationPopup
        setShowFertilizationPopup={setShowFertilizationPopup}
        saveData={saveData} />}

      {/* <button onClick={handleBackClick}>Voltar para Viveiros</button> */}
      {cultivo && biometrics ? (
        
        <div className="biom">
          <h3>Biometrias</h3>
          <table className="biometry-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Data</th>
                <th>Peso Médio (g)</th>
              </tr>
            </thead>
            <tbody>
              {biometrics.map((biometry, index) => (
                <tr key={index}>
                  <td><strong>{formatDate(biometry.data).date}</strong></td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(biometry.pesoMedio).toLocaleString("pt-BR", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })} g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (cultivo ? <p className="infos">Nenhuma biometria realizada </p> :
        <p className="infos">Aguardando lançamento</p>
      )
      }

      <div className="icon-container">
        <div className="icon-container-inner">
          <button className="side-icon-button" onClick={() => navigate('/viveiros')}>
            <div>
              <FontAwesomeIcon icon={faShrimp} className="icon" />
            </div>
            <span className="side-icon-button-text">Viveiros</span>
          </button>
          <img
            src={aquaDataIcon}
            alt="Aqua Data Icon"
            style={{ width: '100px', height: '100px' }}
            onClick={() => navigate('/dashboard')}
            className="centered-image"
          />
          <button className="side-icon-button" onClick={() => navigate('/estoque')}>
            <div>
              <FontAwesomeIcon icon={faWarehouse} className="icon" />
            </div>
            <span className="side-icon-button-text">Estoque</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PondDetail;
