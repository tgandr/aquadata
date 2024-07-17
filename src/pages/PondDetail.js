import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/PondDetail.css';
import ParamPopup from './ParamPopup';
import FeedPopup from './FeedPopup';
import NewCyclePopup from './NewCyclePopup';
import BiometryPopup from './BiometryPopup';
import HarvestPopup from './HarvestPopup';
import FertilizationPopup from './FertilizationPopup';
import { formatDate, IconContainer } from './utils';

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
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [showParamPopup, setShowParamPopup] = useState(false);
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
  const [feedUsed, setFeedUsed] = useState('');
  const [parcialProduction, setParcialProdution] = useState({});

  const [form, setForm] = useState({
    dataPovoamento: '',
    origemPL: '',
    quantidadeEstocada: '',
    testeEstresse: '',
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
  }, [viveiroId, showFeedPopup]);

  useEffect(() => {
    if (cultivo) {
      if ('harvest' in cultivo) {
        setParcialProdution(processHarvest());
      }
    } else {
      setParcialProdution({})
    }
  }, [cultivo, harvestData]);

  useEffect(() => {
    if (cultivo && 'feed' in cultivo && Array.isArray(cultivo.feed)) {
      const checkFeed = cultivo.feed.reduce((total, i) => total + parseFloat(i.racaoTotalDia), 0);
      setFeedUsed(checkFeed);
    } else {
      setFeedUsed(0);
    }
  }, [cultivo]);

  const saveData = (data, key) => {
    const storedCultivos = JSON.parse(localStorage.getItem(`history`));
    const i = storedCultivos && storedCultivos.findIndex((viv) => viv.viveiroId === viveiroId);
    if (key in storedCultivos[i]) {
      const toStore = [...storedCultivos[i][key], data];
      const checkOut = { ...storedCultivos[i], [key]: toStore };
      storedCultivos[i] = checkOut;
      localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
      localStorage.setItem('history', JSON.stringify(storedCultivos));
      setCultivo(checkOut);

    } else {
      const checkOut = { ...storedCultivos[i], [key]: [data] };
      storedCultivos[i] = checkOut;
      localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
      localStorage.setItem('history', JSON.stringify(storedCultivos));
      setCultivo(checkOut);
    }
  }

  const processHarvest = () => {
    if (!cultivo.harvest || !Array.isArray(cultivo.harvest)) {
      throw new Error('O array harvest não existe.');
    }
    const parcialHarvests = cultivo.harvest.filter(harvest => harvest.id.totalOrParcial === 'parcial');
    let totalColhida = 0;
    let totalBiomass = 0;
    parcialHarvests.forEach(harvest => {
      const biomasses = harvest.data.biomass ? parseFloat(harvest.data.biomass) : 0;
      let totalWeight = 0;
      let totalCount = 0;
      harvest.data.biometries.forEach(biometry => {
        const weight = biometry.weight ? parseFloat(biometry.weight) : 0;
        const count = biometry.count ? parseFloat(biometry.count) : 0;
        totalWeight += weight;
        totalCount += count;
      });
      const populacaoColhida = (biomasses * 1000) / (totalWeight / totalCount);
      totalColhida += populacaoColhida;
      totalBiomass += biomasses;
    });
    const quantidadeEstocada = cultivo.quantidadeEstocada ? parseFloat(cultivo.quantidadeEstocada) : 0;
    const removedRate = totalColhida / quantidadeEstocada;
    return {
      totalBiomass: totalBiomass,
      removedRate: removedRate
    };
  }

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
            <button className="pond-button" onClick={() => setShowFeedPopup(true)}>
              Ração
              {feedUsed !== 0 ? (<p className="buttons-infos">{feedUsed} kg consumidos</p>) :
                <p className="buttons-infos">Sem consumo</p>}
            </button>
            <button className="pond-button" onClick={() => setShowParamPopup(true)}>Parâmetros da Água</button>
            <button className="pond-button" onClick={() => setShowBiometry(true)}>Biometria</button>
            <button className="pond-button" onClick={() => setShowFertilizationPopup(true)}>Fertilização</button>
            <button className="pond-button" onClick={() => setShowHarvest(true)}>Despescas</button>
            <button className="pond-button" onClick={() => (navigate('/relatorio', {
              state: { ...location.state, id: `cultivo-${cultivo.id}` }
            }))}>
              Relatório
            </button>
            <button className="pond-button">Histórico</button>

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

      {showFeedPopup && <FeedPopup
        setShowFeedPopup={setShowFeedPopup}
        saveData={saveData} 
        cultivo={cultivo}
        setCultivo={setCultivo}/>}

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
        setShowHarvest={setShowHarvest}
        setParcialProdution={setParcialProdution}
        processHarvest={processHarvest} />}

      {showFertilizationPopup && <FertilizationPopup
        setShowFertilizationPopup={setShowFertilizationPopup}
        saveData={saveData} />}

      {parcialProduction.totalBiomass &&
        <>
          <h4 style={{ color: '#1E3A8A', backgroundColor: '#f3f5f0' }}>
            Produção Parcial: <span style={{ color: '#f3f5f0', fontWeight: 'bold', backgroundColor: '#1E3A8A' }}>
              &nbsp;{parcialProduction.totalBiomass} kg&nbsp;</span><br />
            Sobrou&nbsp;{(100 - (parcialProduction.removedRate * 100)).toLocaleString("pt-BR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}% das PLs estocadas
          </h4>
        </>
      }

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
      )}
      <br /><br /><br /><br /><br />

      <IconContainer />

    </div>
  );
};

export default PondDetail;
