import React, { useEffect, useState } from 'react';
import { calculateDepreciation } from './utils';

const HarvestPopup = ({
  cultivo, setCultivo, saveData, harvestData, setHarvestData, survivalRate, setSurvivalRate,
  biometryData, setBiometryData, newPesagem, setNewPesagem, setShowHarvest, database }) => {
  
  const [ponds, setPonds] = useState([])
  const [cultivations, setCultivations] = useState([])
  const [inventory, setInventory] = useState([])
  const [previousHarvestData, setPreviousHarvestData] = useState(true);
  const [totalBiomassHarvested, setTotalBiomassHarvested] = useState('');
  const [finishingHarvest, setFinishingHarvest] = useState({
    show: false,
    buttonText: "Ok"
  });

  const [biometrySamples, setBiometrySamples] = useState(false);
  // const [revenue, setRevenue] = useState('');
  const [harvestTotals, setHarvestTotals] = useState({
    id: {},
    data: {}
  })

  const [hasBiomass, setHasBiomass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [checkHarvestTotalOrParcial, setCheckHarvestTotalOrParcial] = useState('');
  const [showPercentual, setShowPercentual] = useState(false)

  useEffect(() => {
    database.find({
      selector: {dataType: 'pond'}
    }).then(data => {
      setPonds(data.docs)
    })

    database.find({
      selector: {dataType: 'cultivation'}
    }).then(data => {
      setCultivations(data.docs)
    })

    database.find({
      selector: {dataType: 'inventory'}
    }).then(data => {
      setInventory(data.docs)
    })
  },[])

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

  const calcAverageWeight = () => {
    const totalWeight = harvestData.weighings.reduce((accumulator, current) => {
      return accumulator + (parseFloat(current.weight) || 0);
    }, 0);
    const totalCount = harvestData.weighings.reduce((accumulator, current) => {
      return accumulator + (parseFloat(current.count) || 0);
    }, 0);
    return (totalWeight / totalCount).toFixed(1);
    ;
  }

  const handleHarvestConfirm = (e) => {
    e.preventDefault();
    if (harvestTotals.id.totalOrParcial === 'total') {
      const totalBiomassHarvested = (Array.isArray(cultivo.harvest)
        ? cultivo.harvest.reduce((total, harv) => total + parseInt(harv.data.biomass), 0) : 0)
        + parseInt(harvestData.biomass);
      const surviversBefore = (Array.isArray(cultivo.harvest)
        ? cultivo.harvest.reduce((total, harv) => total + parseInt(parseInt(harv.data.biomass * 1000)
        / (harv.data.biometries.reduce((total, biom) => total + parseInt(biom.weight), 0) 
        / harv.data.biometries.reduce((total, biom) => total + parseInt(biom.count), 0))), 0) : 0);
      const surviversAtTotalHarvest = (parseInt(harvestData.biomass) * 1000) / parseInt(biometryData.averageWeight);
      const survivers = surviversAtTotalHarvest + parseInt(surviversBefore);
      const survivalRate = (parseInt(survivers) / parseInt(cultivo.quantidadeEstocada));
      setTotalBiomassHarvested(totalBiomassHarvested);
      setSurvivalRate(survivalRate);
      setHarvestTotals({
        ...harvestTotals,
        data: {
          ...harvestTotals.data,
          biometries: harvestData.weighings,
          biomassAtFinalHarvest: harvestData.biomass,
          totalBiomassHarvested: totalBiomassHarvested,
          survivalRate: survivalRate
        }
      })
    } else { setSurvivalRate(null) }

    if (harvestTotals.id.totalOrParcial === 'parcial') {
      setShowPercentual(true);
      setHarvestTotals({
        ...harvestTotals,
        data: {
          ...harvestTotals.data,
          biomass: harvestData.biomass,
          biometries: harvestData.weighings,
        }
      })
    };
    setErrorMessage('');
    setHarvestData({
      ...harvestData,
      biomass: '',
      weighings: [{ weight: '', count: '' }]
    });
    setFinishingHarvest({ ...finishingHarvest, buttonText: "Corrigir" });
    setHasBiomass(true);
  };

  const calcRevenue = () => {
    const previousRevenues = (Array.isArray(cultivo.harvest) ?
      cultivo.harvest.reduce((total, harv) => total + parseInt(harv.id.price * harv.data.biomass), 0) : 0);
    const finalRevenue = parseInt(harvestTotals.id.price) * parseInt(harvestTotals.data.biomassAtFinalHarvest);
    const revenue = parseInt(previousRevenues + finalRevenue);
    return revenue;
  }

  const handleConfirmId = (e) => {
    e.preventDefault();
    setHarvestTotals({
      ...harvestTotals, id: {
        date: harvestData.date,
        totalOrParcial: harvestData.despesca,
        buyer: harvestData.comprador,
        price: harvestData.precoVenda
      }
    });
    setCheckHarvestTotalOrParcial(harvestData.despesca);
    setHarvestData({
      ...harvestData,
      date: new Date().toISOString().split('T')[0],
      despesca: '',
      comprador: '',
      precoVenda: ''
    })
    setPreviousHarvestData(false);
    setBiometrySamples(true);
  };

  const handleBiometryCalcSubmit = (e) => {
    e.preventDefault();
    const updatedPesagens = [];
    harvestData.weighings[0].weight !== '' ? updatedPesagens.push(newPesagem) : updatedPesagens[0] = newPesagem;
    const calculatedData = calculateBiometry(updatedPesagens);
    setBiometryData(calculatedData);
    setNewPesagem({ weight: '', count: '' });
    setErrorMessage('');
  };

  const calculateBiometry = (pesagens) => {
    harvestData.weighings[0].weight !== '' ? harvestData.weighings.push(newPesagem) : harvestData.weighings = [newPesagem];
    const totalWeight = pesagens.reduce((acc, pesagem) => acc + parseFloat(pesagem.weight), 0);
    const totalCount = pesagens.reduce((acc, pesagem) => acc + parseFloat(pesagem.count), 0);
    const averageWeight = calcAverageWeight();
    return { totalWeight, totalCount, averageWeight };
  };

  const handleSave = () => {
    let checkOut;
    const pondArea = parseFloat((ponds.find(viv => viv._id === cultivo.viveiroId)).area);
    const totalPondsArea = ponds.reduce((total, i) => total + parseFloat(i.area), 0);
    // const pondArea = parseFloat(pond.area);
    const pondPercentage = parseFloat(pondArea / totalPondsArea);

    if (hasBiomass) {
      if ('harvest' in cultivo) {
        const toStore = [...cultivo['harvest'], harvestTotals];
        checkOut = { ...cultivo, ['harvest']: toStore };
      } else {
        checkOut = { ...cultivo, ['harvest']: [harvestTotals] };
      }
      setShowHarvest(false);
    } else {
      setErrorMessage('Indique a biomassa colhida')
    }
    if (harvestTotals.id.totalOrParcial === 'total') {
      // let history = JSON.parse(localStorage.getItem('history'));
      // let closeCultivo = JSON.parse(localStorage.getItem(`cultivo-${cultivo.id}`));
      // history = cultivations.filter((viv) => viv._id !== cultivo._id);

      checkOut = { ...checkOut, 
        hasShrimp: false,
        isCurrent: false,
        depreciationTotal: calculateDepreciation(true, inventory) * pondPercentage };
      // history.push(closeCultivo);
      // localStorage.setItem(`history`, JSON.stringify(history));
      // localStorage.setItem(`cultivo-${cultivo.id}`, JSON.stringify(closeCultivo));
    }
    database.put(checkOut).then(res => {
      checkOut._rev = res.rev
      setCultivo(checkOut)
    })
  };

  const checkBiometry = () => {
    if (biometryData) {
      setBiometrySamples(false);
      setFinishingHarvest({ ...finishingHarvest, show: true });
    } else {
      setErrorMessage('Calcule a biometria antes de finalizar')
    }
  }

  return (
    <>
      {previousHarvestData && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Dados de Despesca</h2>
            <form onSubmit={handleConfirmId} className="harv-form">
              <label>Data:
                <input
                  type="date"
                  name="date"
                  value={harvestData.date}
                  onChange={handleHarvestChange}
                  required />
              </label>
              <label>Despesca:
                <select
                  name="despesca"
                  value={harvestData.despesca}
                  onChange={handleHarvestChange}
                  required>
                  <option value="">Total ou Parcial?</option>
                  <option value="total">Total</option>
                  <option value="parcial">Parcial</option>
                </select>
              </label>
              <label>Comprador:
                <input
                  type="text"
                  name="comprador"
                  value={harvestData.comprador}
                  onChange={handleHarvestChange}
                  required />
              </label>
              <label>Preço de venda:
                <input
                  type="number"
                  name="precoVenda"
                  value={harvestData.precoVenda}
                  onChange={handleHarvestChange}
                  required />
              </label><br /><br /><br />
              <div className="bottom-buttons">
                <button onClick={() => (setShowHarvest(false))} className="cancel-button">Voltar</button>
                <button type="submit" className="first-class-button">Confirmar dados</button>

              </div>
            </form>
          </div>
        </div>
      )}

      {biometrySamples && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Biometria:</h3>
            <div>
              <form onSubmit={handleBiometryCalcSubmit}>
                <div className="biometry-for-harvest">
                  <div className="biometry-inputs">
                    <label>Pesagem:
                      <input
                        type="number"
                        name="weight"
                        value={newPesagem.weight}
                        onChange={handlePesagensChange}
                        required />
                    </label>
                    <label>Contagem:
                      <input
                        type="number"
                        name="count"
                        value={newPesagem.count}
                        onChange={handlePesagensChange}
                        required />
                    </label>
                  </div>
                  <div className="biometry-calc-button">
                    <button type="submit" className="first-class-button">Calcular Biometria</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="result-box">
              {errorMessage && <h4>{errorMessage}</h4>}
              {biometryData && (
                <>
                  <h3>Resultado da Biometria:</h3>
                  {harvestData.weighings.map((pesagem, index) => (
                    <div key={index}>
                      <p>Amostra {index + 1}: {' '}
                        {pesagem.weight} g, {' '}
                        {pesagem.count} camarões - Peso médio {parseFloat(pesagem.weight / pesagem.count).toLocaleString('pt-BR', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1
                        })} g
                      </p>
                    </div>
                  ))}
                  <h4>Peso médio: {parseFloat(biometryData.averageWeight).toLocaleString('pt-BR', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })} g</h4>
                </>
              )}
            </div>
            <div className="bottom-buttons">
              <button type="button" onClick={() =>
                (setBiometrySamples(false), setPreviousHarvestData(true))
              } className="cancel-button">Voltar</button>
              <button type="button" onClick={() => checkBiometry()}
                className="first-class-button">Finalizar despesca</button>
            </div>
          </div>
        </div>
      )}

      {finishingHarvest.show && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Despesca {harvestTotals.id.totalOrParcial}</h3><br />

            <form onSubmit={handleHarvestConfirm} >
              <label htmlFor="biomass">Biomassa despescada (kg):</label>
              <div className="harv-biomass-form">
                <input
                  type="number"
                  name="biomass"
                  id="biomass"
                  value={harvestData.biomass}
                  onChange={handleHarvestChange}
                  required />
                <button type="submit" className="first-class-button">
                  {finishingHarvest.buttonText}
                </button>
              </div>

            </form>

            <div className="result-box">
              <p>Quantidade Estocada: {parseInt(cultivo.quantidadeEstocada).toLocaleString('pt-BR')}</p>

              {cultivo?.harvest?.length > 0 && cultivo.harvest.some(harvestTotals => harvestTotals.id.totalOrParcial === 'total') &&
                <p>Produção anterior: {
                  cultivo.harvest.reduce((total, harvest) => total + parseInt(harvest.data.biomass), 0).toLocaleString('pt-BR')
                } kg </p>}

              {biometryData && (<p>Peso médio: {parseFloat(biometryData.averageWeight).toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })} g</p>)}

              {errorMessage && <h4>{errorMessage}</h4>}

              {(showPercentual && checkHarvestTotalOrParcial === 'parcial') && (
                <>
                  <p>Biomassa despescada: {parseInt(harvestTotals.data.biomass).toLocaleString('pt-BR')} kg</p>
                  <p>Receita apurada: {(harvestTotals.data.biomass * harvestTotals.id.price).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</p>
                  <p>Foram colhidos aproxidamente {(((1000 * harvestTotals.data.biomass) /
                    (biometryData.averageWeight * cultivo.quantidadeEstocada)) * 100)
                    .toLocaleString('pt-BR', {
                      minimumFractionDigits: 1, maximumFractionDigits: 1
                    })}
                    % da população estocada</p>
                </>)}

              {(checkHarvestTotalOrParcial === 'total') && (
                survivalRate && (
                  <>
                    <p>Produção total do viveiro: {totalBiomassHarvested.toLocaleString('pt-BR')} kg</p>
                    <p>Sobrevivência: {(survivalRate * 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%</p>
                    <p>Receita do cultivo: {calcRevenue().toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</p>
                  </>
                ))}
            </div>
            <div className="bottom-buttons">
              <button onClick={() => setShowHarvest(false)} className="cancel-button">Cancelar</button>
              <button onClick={handleSave} className="first-class-button">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )

}

export default HarvestPopup;