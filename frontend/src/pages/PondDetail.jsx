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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faSave } from '@fortawesome/free-solid-svg-icons';
import useDatabase from '../hooks/useDatabase'
import LocalDb from '../databases/local.db';

const PondDetail = () => {
  const db = useDatabase();
  const [formData,setFormData] = useState() 
  const location = useLocation();
  const navigate = useNavigate();
  const viveiroId = location.state.viveiro._id;
  const viveiroName = location.state.viveiro.nome;
  const farmName = location.state.farmName;
  const [stockData, setStockData] = useState()
  const [cultivation, setCultivation] = useState(null);
  const [showNewCyclePopup, setShowNewCyclePopup] = useState(false);
  const [showStressTestPopup, setShowStressTestPopup] = useState(false);
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [showParamPopup, setShowParamPopup] = useState(false);
  const [showBiometry, setShowBiometry] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [cultivationHistory, setCultivationHistory] = useState([]);
  const [showHarvest, setShowHarvest] = useState(false);
  const [survivalRate, setSurvivalRate] = useState(null);
  const [biometryData, setBiometryData] = useState(null);
  const [newPesagem, setNewPesagem] = useState({ weight: '', count: '' });
  const [biometrics, setBiometrics] = useState(null);
  const [showFertilizationPopup, setShowFertilizationPopup] = useState(false);
  const [feedUsed, setFeedUsed] = useState('');
  const [parcialProduction, setParcialProdution] = useState({});
  const [showMetas, setShowMetas] = useState(false);
  const [showMetasTable, setShowMetasTable] = useState(false);
  const [area, setArea] = useState(0);
  // const [showEditData, setShowEditData] = useState(false);
  const [editMetas, setEditMetas] = useState({
    sobrevivencia: false,
    tamanho: false,
    tempo: false
  });
  const [metas, setMetas] = useState({
    sobrevivencia: '',
    tamanho: '',
    tempo: ''
  })

  const [form, setForm] = useState({
    dataPovoamento: '',
    origemPL: '',
    quantidadeEstocada: '',
    testeEstresse: '',
    uniformidade: ''
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

  const loadHistory = async () => {
    setShowHistory(true);
    // const history = JSON.parse(localStorage.getItem('history'));
    // const storedCultivations = await db.find({
    //   selector: {
    //     dataType: 'cultivation',
    //     viveiroId
    //   }
    // })
    // const storedCultivos = history ? history.filter((viv) => viv.viveiroId === viveiroId) : [];
    // setHistory(storedCultivations);
  }

  useEffect(() => {
    if (!db) return 

    db.find({
      selector: {
        dataType: 'cultivation',
        viveiroId,
      }
    }).then(data => {
      setCultivationHistory(data.docs)
      const currentCultivation = data.docs.find(c => c.isCurrent == true)
      setCultivation(currentCultivation)
    })

    db.find({
      selector: {dataType: 'stockData'}
    }).then(data => {
      const stock = data.docs[0]
      if (!stock) return
      setStockData(stock)
    })

    db.get(viveiroId).then(data => {
      setArea(data.area * 10_000)
    })

    LocalDb.get('user').then(setFormData)
  }, [db])
  
  useEffect(() => {
    if (!cultivation) return

    cultivation.biometrics && setBiometrics(cultivation.biometrics)
    
    if (cultivation.metas) {
      setMetas(cultivation.metas)
      setShowMetasTable(true);
    }
    // const storedCultivos = JSON.parse(localStorage.getItem(`history`));
    // const storedCultivo = storedCultivos && storedCultivos.filter((viv) =>
    //   viv.viveiroId === viveiroId);
    // if (storedCultivo) {
    //   for (const c of storedCultivo) {
    //     const data = JSON.parse(localStorage.getItem(`cultivo-${c.id}`));
    //     if (data) {
    //       const viveiroData = data;
    //       setCultivo(viveiroData);
    //       if (viveiroData) {
    //         if (viveiroData.biometrics) {
    //           setBiometrics(viveiroData.biometrics);
    //         }
    //       }
    //       if (viveiroData.metas) {
    //         setMetas(viveiroData.metas);
    //         
    //       }
    //       break;
    //     }
    //   }
    // }
  }, [cultivation,viveiroId, showFeedPopup]);

  useEffect(() => {
    if (cultivation) {
      if ('harvest' in cultivation) {
        setParcialProdution(processHarvest());
      }
    } else {
      setParcialProdution({})
    }
  }, [cultivation, harvestData]);

  useEffect(() => {
    if (cultivation && 'feed' in cultivation && Array.isArray(cultivation.feed)) {
      const checkFeed = cultivation.feed.reduce((total, i) => total + parseFloat(i.racaoTotalDia), 0);
      setFeedUsed(checkFeed);
    } else {
      setFeedUsed(0);
    }
  }, [cultivation]);

  const saveData = (data, key) => {
    let checkOut;
    // const storedCultivos = JSON.parse(localStorage.getItem(`history`));
    // const i = storedCultivos && storedCultivos.findIndex((viv) =>
    // viv.viveiroId === viveiroId);
    if (key in cultivation) {
      const toStore = [...cultivation[key], data];
      checkOut = { ...cultivation, [key]: toStore };
      // checkOut._id = v4()
      // checkOut.dataType = 'cultivation'
      // checkOut.isCurrent = true
      // storedCultivos[i] = checkOut;
      // localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
      // localStorage.setItem('history', JSON.stringify(storedCultivos));
    } else {
      checkOut = { ...cultivation, [key]: [data] };
      // localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
      // localStorage.setItem('history', JSON.stringify(storedCultivos));
    }
    db.put(checkOut).then(response => {
      checkOut._rev = response.rev
      setCultivation(checkOut)
    })
  }

  const processHarvest = () => {
    if (!cultivation.harvest || !Array.isArray(cultivation.harvest)) {
      throw new Error('O array harvest não existe.');
    }
    const parcialHarvests = cultivation.harvest.filter(harvest => harvest.id.totalOrParcial === 'parcial');
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
    const quantidadeEstocada = cultivation.quantidadeEstocada ? parseFloat(cultivation.quantidadeEstocada) : 0;
    const removedRate = totalColhida / quantidadeEstocada;
    return {
      totalBiomass: totalBiomass,
      removedRate: removedRate
    };
  }

  const handleEditMetaChange = (e) => {
    const { name, value } = e.target;
    setMetas({ ...metas, [name]: parseInt(value) })
  };

  const handleMetasSubtmit = (meta) => {
    // let toUpdate = JSON.parse(localStorage.getItem('history'));
    // const toUpdate = cultivationHistory.filter(h => h.id !== cultivo.id)
    if (metas[meta]) {
      const cultivoCheckOut = {
        ...cultivation, metas: {
          ...cultivation.metas, [meta]: metas[meta]
        }
      }
      // toUpdate.push(cultivoCheckOut)
      db.put(cultivoCheckOut).then(response => {
        cultivoCheckOut._rev = response.rev
        setCultivation(cultivoCheckOut);
      })

      // localStorage.setItem(`cultivo-${cultivo.id}`, JSON.stringify(cultivoCheckOut));
      // localStorage.setItem('history', JSON.stringify(toUpdate));
    } else {
      alert('Por favor, verifique e tente novamente.');
    }
  }

  const exitMetas = () => {
    const metasNaoSalvas = [];
    if (editMetas.tempo) metasNaoSalvas.push("tempo");
    if (editMetas.tamanho) metasNaoSalvas.push("tamanho");
    if (editMetas.sobrevivencia) metasNaoSalvas.push("sobrevivência");
    if (metasNaoSalvas.length > 0) {
      if (metasNaoSalvas.length === 1) {
        alert(`Salvar meta de ${metasNaoSalvas[0]}!`)
      }
      if (metasNaoSalvas.length === 2) {
        alert(`Salvar metas ${metasNaoSalvas.join(" e ")}!`)
      }
      if (metasNaoSalvas.length === 3) {
        alert(`Salvar metas ${metasNaoSalvas.join(", ")}!`)
      }
    } else {
      setShowMetas(false);
    }
  }

  return (

    <div className="pond-detail">
      <div className="identify-data">
        <h2>{viveiroName}</h2>
        <h3>{farmName}</h3>
      </div>
      {cultivation ? (
        <>
          <div className="infos" style={{ width: '90%' }}>
            <div style={
              {
                borderRadius: '5px',
                overflow: 'hidden',
                border: '1px solid #1E3A8A',
                marginLeft: '1px',
                marginRight: '1px'
              }}>
              <table
                style={{ width: '100%', borderCollapse: 'collapse' }}
                // onClick={() => setShowEditData(true)}
                onClick={() => setShowNewCyclePopup(true)}>
                <tbody>
                  <tr>

                    <td style={{ textAlign: 'left', paddingLeft: '5px' }}>
                      <strong>Origem da PL:</strong> {cultivation.origemPL}
                    </td>
                    <td rowSpan="3" style={
                      {
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        width: '30%',
                        borderLeft: '1px solid #1E3A8A'
                      }}>
                      <p style={{ fontSize: '1.5rem' }}>
                        <strong>{formatDate(cultivation.dataPovoamento).days}</strong></p>dias<br />
                      {formatDate(cultivation.dataPovoamento).date}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '5px' }}>
                      <strong>Quantidade Estocada:</strong> {parseInt(cultivation.quantidadeEstocada).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                  <tr>

                    <td style={{ textAlign: 'left', paddingLeft: '5px' }}>
                      <strong>Densidade:</strong> {parcialProduction.totalBiomass && cultivation.hasShrimp ? (
                        ((1 - parcialProduction.removedRate) * cultivation.quantidadeEstocada / area).toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) + " camarões/m²"
                      ) : (
                        parseInt(cultivation.quantidadeEstocada / area) + " camarões/m²"
                      )}
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>
          </ div>

          <div className="buttons-container">
            {showButtons && (
              <>
                <button className="pond-button1" onClick={() => setShowFeedPopup(true)}>
                  <i className="fas fa-bowl-rice"></i> Ração
                  {feedUsed !== 0 ? (<p className="buttons-infos">{feedUsed} kg consumidos</p>) :
                    <p className="buttons-infos">Sem consumo</p>}
                </button>
                <button className="pond-button1" onClick={() => setShowParamPopup(true)}>
                  <i className="fas fa-water"></i> Parâmetros da Água
                </button>
                <button className="pond-button1" onClick={() => setShowBiometry(true)}>
                  <i className="fas fa-ruler"></i> Biometria
                </button>
                <button className="pond-button1" onClick={() => setShowFertilizationPopup(true)}>
                  <i className="fas fa-boxes-stacked"></i> Fertilização
                </button>
                <div className="group-divider"></div>

                <button className="pond-button2" onClick={() => setShowMetas(true)}>
                  <i className="fas fa-trophy"></i> Metas
                  {cultivation.metas ? (<p className="buttons-infos">Produção de {(cultivation.quantidadeEstocada *
                    cultivation.metas.sobrevivencia / 100 *
                    cultivation.metas.tamanho / 1000)
                    .toLocaleString('pt-BR')} kg</p>) :
                    (<p className="buttons-infos">Sem metas registradas</p>)}
                </button>
                <button className="pond-button2" onClick={() => setShowHarvest(true)}>
                  <i className="fas fa-shrimp"></i> Despescas
                </button>
              </>
            )}
            <button className="pond-button2" onClick={() => navigate('/relatorio', { state: { ...location.state, id: cultivation._id } })}>
              <i className="fas fa-chart-line"></i> Relatório
            </button>
            <button className="pond-button2" onClick={() => loadHistory()}>
              <i className="fas fa-history"></i> Histórico
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>O viveiro está vazio</h3>
          <button onClick={() => setShowNewCyclePopup(true)}>Novo Ciclo de Cultivo</button>
          <button onClick={() => loadHistory()}>Histórico</button>
        </>
      )}

      {showHistory &&
        <>
          <div className="popup">
            <div className="popup-inner">
              <h3>Histórico</h3>
              {cultivationHistory ?
                (cultivationHistory.length > 0 ?
                  (cultivationHistory.map((hist, index) => (!hist.hasShrimp &&
                    <button 
                      key={index} 
                      onClick={() => (
                        setShowHistory(false),
                        setCultivation(hist), 
                        setShowButtons(false))
                    }>
                      {formatDate(hist.dataPovoamento).date} a {" "}
                      {hist.harvest && hist.harvest.length > 0 ? (
                        formatDate(hist.harvest[hist.harvest.length - 1].id.date).date
                      ) : (
                        "Sem data de colheita"
                      )}
                    </button>
                  ))) : <p>Sem cultivos anteriores</p>) 
                  :
                  <p>Sem cultivos anteriores</p>
              }
              <button className="cancel-button" onClick={() => setShowHistory(false)}>Voltar</button>
            </div>
          </div>
        </>
      }

      {showNewCyclePopup && <NewCyclePopup
        showNewCyclePopup={showNewCyclePopup} setShowNewCyclePopup={setShowNewCyclePopup}
        showStressTestPopup={showStressTestPopup} setShowStressTestPopup={setShowStressTestPopup}
        form={form} setForm={setForm}
        viveiroId={viveiroId}
        cultivation={cultivation}
        setCultivo={setCultivation}
        database={db}
        pondArea={area}/>}

      {showFeedPopup && <FeedPopup
        setShowFeedPopup={setShowFeedPopup}
        saveData={saveData}
        base={{
          cultivo: cultivation,
          setCultivo: setCultivation,
          stockData,
          setStockData,
          cultivationHistory,
          db
        }}
        />}

      {showParamPopup && <ParamPopup setShowParamPopup={setShowParamPopup} saveData={saveData} />}

      {showBiometry && <BiometryPopup
        viveiroId={viveiroId}
        formBiometry={formBiometry}
        setShowBiometry={setShowBiometry}
        setFormBiometry={setFormBiometry}
        setBiometrics={setBiometrics}
        cultivation={cultivation}
        setCultivation={setCultivation}
        database={db}  
      />}

      {showHarvest && <HarvestPopup
        cultivo={cultivation}
        setCultivo={setCultivation}
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
        processHarvest={processHarvest}
        database={db}/>}

      {showFertilizationPopup && <FertilizationPopup
        setShowFertilizationPopup={setShowFertilizationPopup}
        saveData={saveData} 
        database={db}
      />}

      {parcialProduction.totalBiomass && cultivation.hasShrimp &&
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

      {showMetas &&
        <div className="popup">
          <div className="popup-inner">
            {showMetasTable ? (
              <>
                <h3>Metas</h3>
                <p>A meta é produzir {(cultivation.quantidadeEstocada *
                  (cultivation.metas.sobrevivencia / 100) * (cultivation.metas.tamanho / 1000))
                  .toLocaleString('pt-BR')} kg</p>
                <table className="biometry-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>Índices zootécnicos</th>
                      <th>Meta</th>
                      <th>Editar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Sobrevivência - %</strong></td>
                      <td style={{ textAlign: 'right' }}>{editMetas.sobrevivencia
                        ? (<input
                          type='number'
                          name='sobrevivencia'
                          value={metas.sobrevivencia}
                          onChange={handleEditMetaChange} />)
                        : `${cultivation.metas.sobrevivencia} %`}</td>
                      <td style={{ textAlign: "center" }}>
                        {editMetas.sobrevivencia
                          ? <button className="delete-button" onClick={() => {
                            setEditMetas({
                              ...editMetas,
                              sobrevivencia: false
                            }); handleMetasSubtmit('sobrevivencia')
                          }}>
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          : <button className="delete-button" onClick={() => setEditMetas({
                            ...editMetas,
                            sobrevivencia: true
                          })}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Tamanho - gramas</strong></td>
                      <td style={{ textAlign: 'right' }}>{editMetas.tamanho
                        ? (<input
                          type='number'
                          name='tamanho'
                          value={metas.tamanho}
                          onChange={handleEditMetaChange} />)
                        : `${cultivation.metas.tamanho} g`}</td>
                      <td style={{ textAlign: "center" }}>
                        {editMetas.tamanho
                          ? <button className="delete-button" onClick={() => {
                            setEditMetas({
                              ...editMetas,
                              tamanho: false
                            }); handleMetasSubtmit('tamanho')
                          }}>
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          : <button className="delete-button" onClick={() => setEditMetas({
                            ...editMetas,
                            tamanho: true
                          })}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Tempo de cultivo - dias</strong></td>
                      <td style={{ textAlign: 'right' }}>{editMetas.tempo
                        ? (<input
                          type='number'
                          name='tempo'
                          value={metas.tempo}
                          onChange={handleEditMetaChange} />)
                        : `${cultivation.metas.tempo} dias`}</td>
                      <td style={{ textAlign: "center" }}>
                        {editMetas.tempo
                          ? <button className="delete-button" onClick={() => {
                            setEditMetas({
                              ...editMetas,
                              tempo: false
                            }); handleMetasSubtmit('tempo')
                          }}>
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          : <button className="delete-button" onClick={() => setEditMetas({
                            ...editMetas,
                            tempo: true
                          })}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <p>
                  Não há metas registradas
                </p>
                <button type='button' className='meta-button'
                  onClick={() => {
                    setCultivation({
                      ...cultivation, metas: {
                        sobrevivencia: 0, tamanho: 0, tempo: 0
                      }
                    }); setShowMetasTable(true)
                  }}>
                  Registrar metas
                </button>
              </>
            )}
            <br /><br /><br />
            <div className="bottom-buttons">
              <button type="button" onClick={() => exitMetas()} className="cancel-button">Voltar</button>
            </div>
          </div>
        </div>
      }

      {cultivation &&
        !cultivation.hasShrimp && showButtons &&
        <>
          <h4>Despesca total finalizada. <br />Deseja encerrar o viveiro?</h4>
          <div className="box-buttons">
            <button className="cancel-button">Não</button>
            <button
              className="first-class-button"
              onClick={() => {
                // localStorage.removeItem(`cultivo-${cultivation.id}`);
                alert('O viveiro foi encerrado com sucesso.');
                // window.location.reload();
                navigate('/viveiros')
              }}
            >
              Sim
            </button>

          </div>
        </>
      }

      {cultivation && biometrics ? (
        <div className="biom">
          <h3>Biometrias</h3>
          <table className="biometry-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Data</th>
                <th>Peso Médio (g)</th>
                <th>Biomassa</th>
              </tr>
            </thead>
            <tbody>
              {biometrics.slice().reverse().map((biometry, index) => (
                <tr key={index}>
                  <td><strong>{formatDate(biometry.data).date}</strong></td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(biometry.pesoMedio).toLocaleString("pt-BR", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })} g</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(biometry.pesoMedio * cultivation.quantidadeEstocada / 1000)
                    .toLocaleString("pt-BR", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })} Kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (!cultivation ? <p className="infos">Aguardando lançamento</p> :
        (showButtons && <p className="infos">Nenhuma biometria realizada </p>)
      )}
      <br /><br /><br /><br /><br />

      <IconContainer formData={formData}/>

    </div>
  );
};

export default PondDetail;
