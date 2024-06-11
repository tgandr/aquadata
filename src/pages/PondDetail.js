import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PondDetail.css';
import SanityAnalysis from './SanityAnalysis';
import ParamPopup from './ParamPopup';
import FeedPopup from './FeedPopup';
import NewCyclePopup from './NewCyclePopup';
import BiometryPopup from './BiometryPopup';
import HarvestPopup from './HarvestPopup';
import FertilizationPopup from './FertilizationPopup';

const PondDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viveiroId = location.state.id;
  const viveiroName = location.state.nome;

  const [cultivo, setCultivo] = useState(null);
  const [showNewCyclePopup, setShowNewCyclePopup] = useState(false);
  const [showStressTestPopup, setShowStressTestPopup] = useState(false);
  const [showCountPlPopup, setShowCountPlPopup] = useState(false);
  const [showCamCountPopup, setShowCamCountPopup] = useState(false);
  const [showFeedPopup, setshowFeedPopup] = useState(false);
  const [showParamPopup, setShowParamPopup] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [showBiometry, setShowBiometry] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState({show: false, buttonText: 'Pesagem'});
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
    despesca: 'total',
    biomass: '',
    pesagens: [{ weight: '', count: '' }],
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
      <h2>Detalhes do {viveiroName}</h2>
      {cultivo ? (
        <div>
          <div className="infos">
            <h3>Cultivo em Curso</h3>
            <p>Povoamento em {formatDate(cultivo.dataPovoamento).date}, {formatDate(cultivo.dataPovoamento).days} dias de cultivo</p>
            <p>Origem da PL: {cultivo.origemPL}</p>
            <p>Quantidade Estocada: {parseInt(cultivo.quantidadeEstocada).toLocaleString('pt-BR')}</p>
          </ div>
          <div className="buttons-container">
            <button className="pond-button" onClick={() => setshowFeedPopup(true)}>Ração</button>
            <button className="pond-button" onClick={() => setShowParamPopup(true)}>Parâmetros da Água</button>
            <button className="pond-button" onClick={() => setShowAnalysisPopup(true)}>Análise Presuntiva</button>
            <button className="pond-button" onClick={() => setShowBiometry(true)}>Biometria</button>
            <button className="pond-button" onClick={() => setShowHarvest(true)}>Dados de despesca</button>
            <button className="pond-button" onClick={() => setShowFertilizationPopup(true)}>Fertilização</button>
            <button className="pond-button">Histórico</button>
            <button className="pond-button">Relatório Parcial</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>O viveiro está vazio</h3>
          <button onClick={() => setShowNewCyclePopup(true)}>Novo Ciclo de Cultivo</button>
        </div>
      )}

      {showNewCyclePopup && <NewCyclePopup
        showNewCyclePopup={showNewCyclePopup}       setShowNewCyclePopup={setShowNewCyclePopup}
        showStressTestPopup={showStressTestPopup}   setShowStressTestPopup={setShowStressTestPopup}
        showCountPlPopup={showCountPlPopup}         setShowCountPlPopup={setShowCountPlPopup}
        showCamCountPopup={showCamCountPopup}       setShowCamCountPopup={setShowCamCountPopup}
        showWeightInput={showWeightInput}           setShowWeightInput={setShowWeightInput}
        showPLgrama={showPLgrama}                   setShowPLgrama={setShowPLgrama}
        darkPoints={darkPoints}                     setDarkPoints={setDarkPoints}               
        threshold={threshold}                       setThreshold={setThreshold}
        userCount={userCount}                       setUserCount={setUserCount}
        processedImage={processedImage}             setProcessedImage={setProcessedImage}
        capturedImage={capturedImage}               setCapturedImage={setCapturedImage}
        weight={weight}                             setWeight={setWeight}
        showCamera={showCamera}                     setShowCamera={setShowCamera}
        form={form}                                 setForm={setForm}
        viveiroId={viveiroId}
        setCultivo={setCultivo} />}

      {showFeedPopup && <FeedPopup setshowFeedPopup={setshowFeedPopup} />}

      {showParamPopup && <ParamPopup setShowParamPopup={setShowParamPopup} />}

      {showAnalysisPopup && <SanityAnalysis setShowAnalysisPopup={setShowAnalysisPopup} />}

      {showBiometry && <BiometryPopup 
        viveiroId={viveiroId}
        formBiometry={formBiometry}
        setShowBiometry={setShowBiometry}
        setFormBiometry={setFormBiometry} 
        setBiometrics={setBiometrics} />}

      {showHarvest && <HarvestPopup 
        cultivo={cultivo}
        harvestData={harvestData}
        setHarvestData={setHarvestData}
        survivalRate={survivalRate}
        setSurvivalRate={setSurvivalRate}
        biometryData={biometryData}
        setBiometryData={setBiometryData} 
        newPesagem={newPesagem}
        setNewPesagem={setNewPesagem}
        setShowHarvest={setShowHarvest} />}
      
      {showFertilizationPopup && <FertilizationPopup setShowFertilizationPopup={setShowFertilizationPopup} />}

      <button onClick={handleBackClick}>Voltar para Viveiros</button>
      <div>
        {cultivo && biometrics ? (
          <div>
          <h2>Biometrias</h2>
          <ul>
            {biometrics.map((biometry, index) => (
              <li key={index}>
              <strong>{formatDate(biometry.data).date}</strong>,{' '}
              {/* <span>{formatDate(biometry.data).days} dias de cultivo, </span> está calculando até o dia atual*/}
              Peso Médio: {biometry.pesoMedio} g
            </li>            
            ))}
          </ul>
        </div>
        ) : (cultivo ? <p>Nenhuma biometria realizada </p>  :
          <p>Aguardando lançamento</p>
        )
        }
      </div>
    </div>
  );
};

export default PondDetail;
