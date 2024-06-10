import React, {useState} from 'react';

const HarvestPopup = ({
    cultivo,
    harvestData,
    setHarvestData,
    survivalRate,
    setSurvivalRate,
    biometryData,
    setBiometryData,
    newPesagem,
    setNewPesagem,
    setShowHarvest
}) => {
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
    ;}
    
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

    return (
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
    )

}

export default HarvestPopup;