import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PondDetail.css';
import Webcam from 'react-webcam';

const PondDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viveiroId = location.state.id;
  const viveiroName = location.state.nome;

  const [cultivo, setCultivo] = useState(null);
  const [showPopupNewCycle, setShowPopupNewCycle] = useState(false);
  const [showPopupStressTest, setShowPopupStressTest] = useState(false);
  const [showPopupCountPL, setShowPopupCountPL] = useState(false);
  const [showPopupCamCount, setShowPopupCamCount] = useState(false);
  const [showPopupFeed, setShowPopupFeed] = useState(false);
  const [showParamPopup, setShowParamPopup] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [showBiometry, setShowBiometry] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [adjustedCount, setAdjustedCount] = useState(false);
  const [weight, setWeight] = useState(false);
  const [survivalRate, setSurvivalRate] = useState(null);
  const [biometryData, setBiometryData] = useState(null);
  const [newPesagem, setNewPesagem] = useState({ weight: '', count: '' });
  const [biometrics, setBiometrics] = useState(null);
  const [showBiomCalculated, setShowBiomCalculated] = useState(0);
  const webcamRef = useRef(null);
  const [darkPoints, setDarkPoints] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [userCount, setUserCount] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [textButtonCount, setTextButtonCount] = useState('Contar')
  
  const [showAdjustCount, setShowAdjustCount] = useState({
    show: false,
    buttonText: 'Ajustar contagem'
  });
  
  const [form, setForm] = useState({
    dataPovoamento: '',
    origemPL: '',
    quantidadeEstocada: '',
    testeEstresse: false,
    tipoTeste: '',
    alteracaoNatatoria: '',
    larvasMortas: '',
  });

  const [countPLbyPhoto, setCountPLbyPhoto] = useState({
    showPopupCountPL: false,
    weight: '',
    amount: ''
  })
  const [formFeed, setFormFeed] = useState({
    data: new Date().toISOString().split('T')[0],
    racaoTotalDia: '',
    quantidadeTratos: '',
    observacao1: false,
    observacao2: false,
  });
  const [formParam, setFormParam] = useState({
    data: new Date().toISOString().split('T')[0],
    horario: '',
    temperartura:'',
    oxigenioDissolvido: '',
    ph: '',
    amoniaTotal: '',
  });
  const [formAnalysis, setFormAnalysis] = useState({
    data: new Date().toISOString().split('T')[0],
    quantidadeAnimais: '',
    pesoMedio: '',
    conformacaoAntenas: '',
    uropodos: '',
    necrosesIMNV: '',
    camaroesGrampados: '',
    tempoCoagulacao: '',
    analiseCefalotorax: '',
    integridadeTubulos: '',
    presencaLipideos: '',
    conteudoTrato: '',
    replecaoTrato: '',
    branquiasEpicomensais: '',
    epipoditoEpicomensais: '',
    necroseIMNV: '',
    necroseBlackspot: '',
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

  const initialFormBiometryState = {
    data: new Date().toISOString().split('T')[0],
    Pesagem: '',
    Contagem: '',
    pesoMedio: null,
  };

  useEffect(() => {
    const storedCultivo = JSON.parse(localStorage.getItem(`cultivo-${viveiroId}`));
    if (storedCultivo) {
      setCultivo(storedCultivo);
    }
  }, [viveiroId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setFormParam({ ...formParam, [name]: value });
  };

  const handleAnalysisChange = (e) => {
    const { name, value } = e.target;
    setFormAnalysis({ ...formAnalysis, [name]: value });
  };

   const handleBiometrySubmit = (e) => {
     e.preventDefault();
     const { data, Pesagem, Contagem } = formBiometry;
     if (Pesagem && Contagem) {
       const pesoMedio = (Pesagem / Contagem).toFixed(1);
       const biom = { data, Pesagem, Contagem, pesoMedio };
       const viveiroData = JSON.parse(localStorage.getItem(`cultivo-${viveiroId}`));
       viveiroData.biometrics ? viveiroData.biometrics.push(biom) : viveiroData.biometrics = [biom];
       setBiometrics(viveiroData.biometrics);
       localStorage.setItem(`cultivo-${viveiroId}`, JSON.stringify(viveiroData));
       setFormBiometry(initialFormBiometryState);
       setShowBiomCalculated(pesoMedio);
     }
  }

useEffect(() => {
  const viveiroData = localStorage.getItem(`cultivo-${viveiroId}`);
  if (viveiroData) {
    const parsedData = JSON.parse(viveiroData);
    if (parsedData.biometrics) {
      setBiometrics(parsedData.biometrics);
    }
  }
}, [viveiroId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const vivNumber = JSON.parse(localStorage.getItem('viveiros'))[viveiroId - 1];
    const newCultivo = {
      ...form,
      dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0],
      viveiro: parseInt(vivNumber.nome.match(/\d+/)[0])
    };
    localStorage.setItem(`cultivo-${viveiroId}`, JSON.stringify(newCultivo));
    setCultivo(newCultivo);
    setShowPopupNewCycle(false);
  };

  const handleFeedSubmit = (e) => {
    e.preventDefault();
    console.log(formFeed);
    setShowPopupFeed(false);
  };

  const handleParamSubmit = (e) => {
    e.preventDefault();
    console.log(formParam);
    setShowParamPopup(false);
  };

  const handleAnalysisSubmit = (e) => {
    e.preventDefault();
    console.log(formAnalysis);
    setShowAnalysisPopup(false);
  };

  const handleHarvestChange = (e) => {
    const { name, value } = e.target;
    setHarvestData({
      ...harvestData,
      [name]: value
    });
  };

  const handlePesagensChange = (event) => {
    const { name, value } = event.target;
    setNewPesagem((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const calcAverageWeight  = () => {
    const totalWeight = harvestData.pesagens.reduce((accumulator, current) => {
        return accumulator + (parseFloat(current.weight) || 0);
      }, 0);
    const totalCount = harvestData.pesagens.reduce((accumulator, current) => {
        return accumulator + (parseFloat(current.count) || 0);
      }, 0);
    return (totalWeight / totalCount).toFixed(1);
  }

  const handleHarvestConfirm = () => {
    const totalWeight = harvestData.pesagens.reduce((acc, pesagem) => acc + parseFloat(pesagem.weight || 0), 0);
    const totalCount = harvestData.pesagens.reduce((acc, pesagem) => acc + parseFloat(pesagem.count || 0), 0);
    const averageWeight = totalCount ? (totalWeight / totalCount) / 1000 : 0;
    if (harvestData.despesca === 'total') {
      const survivalRate = ((harvestData.biomass / averageWeight) / cultivo.quantidadeEstocada).toFixed(1);
      setSurvivalRate(survivalRate);
    } else {
      setSurvivalRate(null);
    }
  };

const handleBiometryCalcSubmit = () => {
    const updatedPesagens = [];
    harvestData.pesagens[0].weight !== '' ? updatedPesagens.push(newPesagem) : updatedPesagens[0] = newPesagem;
    const calculatedData = calculateBiometry(updatedPesagens);
    setBiometryData(calculatedData);
    setNewPesagem({ weight: '', count: '' });
  };

const calculateBiometry = (pesagens) => {
    harvestData.pesagens[0].weight !== '' ? harvestData.pesagens.push(newPesagem) : harvestData.pesagens = [newPesagem];
    const totalWeight = pesagens.reduce((acc, pesagem) => acc + parseFloat(pesagem.weight), 0);
    const totalCount = pesagens.reduce((acc, pesagem) => acc + parseFloat(pesagem.count), 0);
    const averageWeight = calcAverageWeight();
    return { totalWeight, totalCount, averageWeight };
  };
    
const handleSave = () => {
    setShowHarvest(false);
    console.log('Harvest data saved:', harvestData);
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

  const handleBackClick = () => {
    navigate('/viveiros');
  };

  const handleStressTestClick = (value) => {
    setForm({ ...form, testeEstresse: value });
    if (value === 'Sim') {
      setShowPopupStressTest(true);
      setShowPopupNewCycle(false);
    }
  };

  const handleCountPLbyPhoto = (value) => {
    setCountPLbyPhoto({ ...countPLbyPhoto, showPopupCountPL: value });
    if (value === 'Sim') {
      setShowPopupCountPL(true);
      setShowPopupNewCycle(false);
    }
  };

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      countDarkPoints(imageSrc, threshold);
      setCapturedImage(imageSrc);
      setShowCamera(false);
      setTextButtonCount('Refazer contagem')
    } else {
      setShowCamera(true);
    }
}, [webcamRef, threshold]);

  const countDarkPoints = (imageSrc, threshold) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;
      let darkCount = 0;

      const brightnessData = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        brightnessData.push(brightness < threshold ? 1 : 0);
      }

      const visited = new Array(width * height).fill(false);
      const dfs = (x, y) => {
        const stack = [[x, y]];
        while (stack.length > 0) {
          const [cx, cy] = stack.pop();
          const index = cy * width + cx;
          if (cx >= 0 && cy >= 0 && cx < width && cy < height && !visited[index] && brightnessData[index] === 1) {
            visited[index] = true;
            ctx.beginPath();
            ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
          }
        }
      };

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          if (brightnessData[index] === 1 && !visited[index]) {
            darkCount++;
            dfs(x, y);
          }
        }
      }

      setDarkPoints(darkCount);
      setCountPLbyPhoto({...countPLbyPhoto, amount: darkCount})
      setProcessedImage(canvas.toDataURL());
    };
  };

  const handleUserCountChange = (e) => {
    setUserCount(e.target.value);
  };

  const handleWeightChange = (e) => {
    console.log(e.target.value, 'valor do form')
    console.log(countPLbyPhoto.amount, 'contagem da câmera')
    console.log(countPLbyPhoto.weight, 'peso informado no form')
    setCountPLbyPhoto({...countPLbyPhoto, weight: e.target.value})
  }

  const adjustThreshold = () => {
    const realCount = parseInt(userCount, 10);
    if (!isNaN(realCount) && realCount > 0) {
      const difference = darkPoints - realCount;
      const adjustment = difference / 10;
      setThreshold((prevThreshold) => Math.max(prevThreshold - adjustment, 0));
    }
  };

  const handleWeightSave = (e) => {
    console.log(e); // incluir no LocalStorage com as demais informações de registro do estoque
  }

  const handleAdjustCount = (e) => {
    console.log(e); // incluir no LocalStorage com as demais informações de registro do estoque
  }

  const handleSavePLcount = () => {
    console.log('terminar')
  }

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
            <button className="pond-button" onClick={() => setShowPopupFeed(true)}>Ração</button>
            <button className="pond-button" onClick={() => setShowParamPopup(true)}>Parâmetros da Água</button>
            <button className="pond-button" onClick={() => setShowAnalysisPopup(true)}>Análise Presuntiva</button>
            <button className="pond-button" onClick={() => setShowBiometry(true)}>Biometria</button>
            <button className="pond-button" onClick={() => setShowHarvest(true)}>Dados de despesca</button>
            <button className="pond-button">Fertilização</button>
            <button className="pond-button">Histórico</button>
            <button className="pond-button">Relatório Parcial</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>O viveiro está vazio</h3>
          <button onClick={() => setShowPopupNewCycle(true)}>Novo Ciclo de Cultivo</button>
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
              <label>
                Calcular PL/grama por foto?:
                <div className="stress-test-buttons">
                  <button
                    type="button"
                    className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Sim' ? 'active' : ''}`}
                    onClick={() => handleCountPLbyPhoto('Sim')}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Não' ? 'active' : ''}`}
                    onClick={() => handleCountPLbyPhoto('Não')}
                  >
                    Não
                  </button>
                </div>
              </label>
              <button type="button" onClick={() => (handleSavePLcount)}>Salvar</button>
              <button type="button" onClick={() => setShowPopupNewCycle(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showPopupStressTest && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Teste de Estresse</h3>
            <form>
              <label>
                Tipo de Teste:
                <select name="tipoTeste" value={form.tipoTeste} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="alteracaoSalinidade">Testado com alteração de salinidade</option>
                  <option value="aguaViveiro">Testado com água do viveiro</option>
                </select>
              </label>
              <label>
                Alteração da Resposta Natatória:
                <select name="alteracaoNatatoria" value={form.alteracaoNatatoria} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="nenhuma">Nenhuma alteração</option>
                  <option value="pequena">Pequena alteração</option>
                  <option value="media">Média alteração</option>
                  <option value="grande">Grande alteração</option>
                </select>
              </label>
              <label>
                Larvas Mortas:
                <select name="larvasMortas" value={form.larvasMortas} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="nenhuma">Nenhuma</option>
                  <option value="poucas">Poucas</option>
                  <option value="muitas">Muitas</option>
                </select>
              </label>
              <button type="button" onClick={() => setShowPopupStressTest(false)}>Salvar</button>
              <button type="button" onClick={() => { setShowPopupStressTest(false); setShowPopupNewCycle(true); }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showPopupCountPL && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Calcular PL/grama por foto</h3>
            <div className="results">
              {darkPoints ? <p>Contagem: {darkPoints} pós-larvas</p> : <p>Aguardando contagem</p>} 
              
              {weight && <p>Pesagem: {weight} gramas</p>}
              {countPLbyPhoto.weight && <p>PL/grama: {(countPLbyPhoto.amount / countPLbyPhoto.weight)}</p>}
            </div>
            <button onClick={() => {
              setShowPopupCountPL(false);
              setShowCamera(true);
              setShowPopupCamCount(true)
              } }>
              Foto para contagem
            </button>
            <button>Pesagem</button>
            <button type="button" onClick={ handleSavePLcount() }>Salvar</button>
            <button type="button" onClick={() => { setShowPopupCountPL(false); setShowPopupNewCycle(true); setShowCamera(false); }}>Cancelar</button>
          </div>
        </div>
      )}

      {showPopupCamCount && (
        <div className="popup">
          <div className="popup-inner">
            {showCamera ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
                className="webcam"
              />
            ) : (
              <div>
                <img
                  src={processedImage} 
                  alt="Processed"
                />
              </div>
            )}
            <p>Quantidade: {userCount ? userCount : darkPoints }</p>
            {showAdjustCount.show && (
              <span>
                <label>
                  Se a contagem necessita ajuste, indique abaixo a real contagem de PLs
                  <input
                    type="number"
                    value={userCount}
                    onChange={handleUserCountChange}
                  />
                </label>
              </span>
            )}
            <button onClick={capture}>{textButtonCount}</button>
            <button onClick={ () => {
              if (showAdjustCount.buttonText === 'Ajustar contagem') {
                setShowAdjustCount({show: true, buttonText: 'Confirmar ajuste'});
              } else {
                setShowAdjustCount({show: false, buttonText: 'Ajustar contagem'});
                adjustThreshold();
              }
            }}>
              {showAdjustCount.buttonText}</button>
            <button>Salvar</button>
            <button onClick={ () => { setShowPopupCamCount(false); setShowPopupCountPL(true) }}>Cancelar</button>
          </div>
        </ div>
      )};

{/* <div className="webcam-container">
              {showCamera && (
                
              )}
              <label>
                Pesagem:
                <input
                  type="number"
                  value={countPLbyPhoto.weight}
                  onChange={handleWeightChange}
                />
              </label>
              {(countPLbyPhoto.amount / countPLbyPhoto.weight) == !isNaN && (
                <div>
                  <p>{(countPLbyPhoto.amount / countPLbyPhoto.weight)}</p>
                  <p>{countPLbyPhoto.weight}</p>
                </div>
              )}
              {processedImage && (
                <div>
                  <h3>Processed Image:</h3>
                  <img src={processedImage} alt="Processed" />
                </div>
              )}
              <div>
                
                <button onClick={adjustThreshold}>Confirmar</button>
              </div>
            </div> */}

    {/* {showPopupCountPL && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Calcular PL/grama por foto</h3>
            
            <div className="buttons-container">
              <button onClick={() => setShowCamera(true)}>Foto para contagem</button>
              <button onClick={() => setShowWeightInput(true)}>Pesagem</button>
              <button onClick={handleSave}>Salvar</button>
              <button onClick={() => setShowPopupCountPL(false)}>Cancelar</button>
            </div>
            {showCamera && (
              <div className="webcam-container">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={640}
                  height={480}
                  className="webcam"
                />
                <button onClick={capture}>Contar</button>
                <button onClick={() => setShowAdjustCount(true)}>Ajustar Contagem</button>
                <button onClick={() => { setShowCamera(false); }}>Cancelar</button>
              </div>
            )}
            {showWeightInput && (
              <div>
                <label>
                  Pesagem:
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </label>
                <button onClick={handleWeightSave}>Salvar Pesagem</button>
                <button onClick={() => setShowWeightInput(false)}>Cancelar</button>
              </div>
            )}
            {showAdjustCount && (
              <div>
                <label>
                  Contagem corrigida:
                  <input
                    type="number"
                    value={adjustedCount}
                    onChange={(e) => setAdjustedCount(e.target.value)}
                  />
                </label>
                <button onClick={handleAdjustCount}>Confirmar Ajuste</button>
                <button onClick={() => setShowAdjustCount(false)}>Cancelar</button>
              </div>
            )}
          </div>
        </div>
      )} */}


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
                  type="number"
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
                    Houve sobras de ração
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
                    Reduziu ou suspendeu algum trato
                  </label>
                </div>
              </div>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopupFeed(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showParamPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Parâmetros da Água</h3>
            <form onSubmit={handleParamSubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={formParam.data}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                Horário:
                <select name="horario" value={formParam.horario} onChange={handleParamChange}>
                  <option value="">Selecione um horário</option>
                  <option value="6:00">6:00</option>
                  <option value="14:00">14:00</option>
                  <option value="18:00">18:00</option>
                  <option value="22:00">22:00</option>
                </select>
              </label>
              <label>
                Temperatura:
                <input
                  type="number"
                  name="temperatura"
                  value={formParam.temperartura}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                Oxigênio Dissolvido:
                <input
                  type="number"
                  name="oxigenioDissolvido"
                  value={formParam.oxigenioDissolvido}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                pH:
                <input
                  type="number"
                  name="ph"
                  value={formParam.ph}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                Amônia Total:
                <input
                  type="number"
                  name="amoniaTotal"
                  value={formParam.amoniaTotal}
                  onChange={handleParamChange}
                />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowParamPopup(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showAnalysisPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Análise Presuntiva</h3>
            <form onSubmit={handleAnalysisSubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={formAnalysis.data}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <label>
                Quantidade de Animais Analisados:
                <input
                  type="number"
                  name="quantidadeAnimais"
                  value={formAnalysis.quantidadeAnimais}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <label>
                Peso Médio:
                <input
                  type="number"
                  name="pesoMedio"
                  value={formAnalysis.pesoMedio}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <h3>Conformação Externa</h3>
              <label>
                Antenas:
                <select name="conformacaoAntenas" value={formAnalysis.conformacaoAntenas} onChange={handleAnalysisChange}>
                  <option value="">Selecione</option>
                  <option value="normais">Normais</option>
                  <option value="quebradiças">Quebradiças</option>
                  <option value="rugosas">Rugosas</option>
                </select>
              </label>
              <label>
                Urópodos:
                <select name="uropodos" value={formAnalysis.uropodos} onChange={handleAnalysisChange}>
                  <option value="">Selecione</option>
                  <option value="normais">Normais</option>
                  <option value="luminescentes">Luminescentes</option>
                  <option value="avermelhados">Avermelhados</option>
                </select>
              </label>
              <label>
                Presença de Necroses Indicativas de IMNV:
                <select name="necrosesIMNV" value={formAnalysis.necrosesIMNV} onChange={handleAnalysisChange}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="não">Não</option>
                </select>
              </label>
              <label>
                Camarões Grampados:
                <select name="camaroesGrampados" value={formAnalysis.camaroesGrampados} onChange={handleAnalysisChange}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="não">Não</option>
                </select>
              </label>
              <label>
                Tempo de Coagulação da Hemolinfa:
                <input
                  type="number"
                  name="tempoCoagulacao"
                  value={formAnalysis.tempoCoagulacao}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <label>
                Análise de Cefalotórax:
                <input
                  type="number"
                  name="analiseCefalotorax"
                  value={formAnalysis.analiseCefalotorax}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
                <h3>Hepatopâncreas</h3>
              <label>
                Integridade dos Túbulos:
                <input
                  type="number"
                  name="integridadeTubulos"
                  value={formAnalysis.integridadeTubulos}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <label>
                Presença de Lipídeos:
                <input
                  type="number"
                  name="presencaLipideos"
                  value={formAnalysis.presencaLipideos}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <h3>Trato Digestório</h3>
              <label>
                Conteúdo:
                <input
                  type="number"
                  name="conteudoTrato"
                  value={formAnalysis.conteudoTrato}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <label>
                Repleação:
                <input
                  type="number"
                  name="replecaoTrato"
                  value={formAnalysis.replecaoTrato}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <h3>Presença de Epicomensais</h3>
              <label>
                Brânquias:
                <input
                  type="number"
                  name="branquiasEpicomensais"
                  value={formAnalysis.branquiasEpicomensais}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <label>
                Epipodito:
                <input
                  type="number"
                  name="epipoditoEpicomensais"
                  value={formAnalysis.epipoditoEpicomensais}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <h3>Necrose</h3>
              <label>
                IMNV:
                <input
                  type="number"
                  name="necroseIMNV"
                  value={formAnalysis.necroseIMNV}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <label>
                Blackspot:
                <input
                  type="number"
                  name="necroseBlackspot"
                  value={formAnalysis.necroseBlackspot}
                  onChange={handleAnalysisChange}
                  required
                />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowAnalysisPopup(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showBiometry && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Anotar Biometria</h3>
            <h3>Peso Médio: {showBiomCalculated} g</h3> 
            <form onSubmit={handleBiometrySubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={formBiometry.data}
                  onChange={(e) => setFormBiometry({ ...formBiometry, data: e.target.value })}
                  required
                />
              </label>
              <label>
                Pesagem (em gramas):
                <input
                  type="number"
                  name="Pesagem"
                  value={formBiometry.Pesagem}
                  onChange={(e) => setFormBiometry({ ...formBiometry, Pesagem: e.target.value })}
                  required
                />
              </label>
              <label>
                Contagem:
                <input
                  type="number"
                  name="Contagem"
                  value={formBiometry.Contagem}
                  onChange={(e) => setFormBiometry({ ...formBiometry, Contagem: e.target.value })}
                  required
                />
              </label>
              <button type="submit">Calcular o peso médio</button>
            </form>
            <button type="button" onClick={() => setShowBiometry(false)}>Fechar</button>
          </div>
        </div>
      )}

      {showHarvest && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Dados de Despesca</h2>
            <form>
              <label>Data:
                <input type="date" name="date" value={harvestData.date} onChange={handleHarvestChange} />
              </label>
              <label>Despesca:
                <select name="despesca" value={harvestData.despesca} onChange={handleHarvestChange}>
                  <option value="total">Total</option>
                  <option value="parcial">Parcial</option>
                </select>
              </label>
              <label>Biometria:</label>
              <div>
                  <label>Pesagem:
                    <input type="number" name="weight" value={newPesagem.weight} onChange={handlePesagensChange} />
                  </label>    
                  <label>Contagem:
                    <input type="number" name="count" value={newPesagem.count} onChange={handlePesagensChange} />
                  </label>
                </div>
              <button type="button" onClick={handleBiometryCalcSubmit}>Calcular Biometria</button>
              {biometryData && (
                  <h3>Resultado da Biometria:</h3>
              )}
              {biometryData && harvestData.pesagens.map((pesagem, index) => 
                (<div key={index}>
                  <p>Amostra {index + 1}: {' '}
                  {harvestData.pesagens[index].weight} g, {' '}
                  {harvestData.pesagens[index].count} camarões - 
                  Peso médio {(harvestData.pesagens[index].weight / harvestData.pesagens[index].count).toFixed(1)} g
                  </p>
                </div>)
              )}
              {biometryData && (
                  <p>Peso médio: {biometryData.averageWeight} g</p>
              )}
              {survivalRate && (
                  <p>Sobrevivência: {survivalRate * 100}%</p>
              )}
              <label>Biomassa colhida (kg):
                <input type="number" name="biomass" value={harvestData.biomass} onChange={handleHarvestChange} />
              </label>
              <label>Comprador:
                <input type="text" name="comprador" value={harvestData.comprador} onChange={handleHarvestChange} />
              </label>
              <label>Preço de venda:
                <input type="number" name="precoVenda" value={harvestData.precoVenda} onChange={handleHarvestChange} />
              </label>
              <button type="button" onClick={handleHarvestConfirm}>Confirmar dados</button>
            </form>
            <button onClick={handleSave}>Salvar</button>
            <button onClick={() => setShowHarvest(false)}>Cancelar</button>
          </div>
        </div>
      )}

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
