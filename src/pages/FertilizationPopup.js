import React, { useState, useEffect } from 'react';

const FertilizationPopup = ({ setShowFertilizationPopup, saveData }) => {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [fertilizerType, setFertilizerType] = useState('');
  const [chemicalFertilizer, setChemicalFertilizer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customChemicalFertilizer, setCustomChemicalFertilizer] = useState('');
  const [addNewFert, setAddNewFert] = useState(false);
  const [fertilizers, setFertilizers] = useState([
    "NPK",
    "Fosfato Monopotássico",
    "Sulfato de Amônio"
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    const dataToSave = {
      data: data,
      tipoFertilizante: fertilizerType,
      fertilizanteQuimico: chemicalFertilizer,
      quantidade: quantity
    }

    if (fertilizerType === 'Químico' && customChemicalFertilizer) {
      setFertilizers(prevFertilizers => [...prevFertilizers, customChemicalFertilizer]);
    }
    saveData(dataToSave, 'fertilizers')
    setShowFertilizationPopup(false);
  };

  const saveFertilizersList = (newFert) => {
    if (newFert != '') {
      setFertilizers([...fertilizers, newFert]);
      setChemicalFertilizer(newFert);
      setCustomChemicalFertilizer('');
      let fertilizersList = JSON.parse(localStorage.getItem('stockData'));
      if ('fertilizersList' in fertilizersList) {
        fertilizersList.fertilizersList.push(newFert);
      } else {
        fertilizersList.fertilizersList = [...fertilizers, newFert]
      }
      localStorage.setItem('stockData', JSON.stringify(fertilizersList));
    }
    setAddNewFert(false);

  }

  useEffect(() => {
    const checkFertilizersList = JSON.parse(localStorage.getItem('stockData')) || {};
    if ('fertilizersList' in checkFertilizersList) {
      setFertilizers(checkFertilizersList.fertilizersList);
    }
  }, []);

  useEffect(() => {
    if (chemicalFertilizer === 'custom') {
      setAddNewFert(true);
    } else {
      setAddNewFert(false);
    }
  }, [chemicalFertilizer]);

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Fertilização</h2>
        <form onSubmit={handleSave} className="harv-form">
          <label>Data:
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required />
          </label>
          <label>Tipo de Fertilizante:
            <select
              value={fertilizerType}
              onChange={(e) => setFertilizerType(e.target.value)}
              required>
              <option value="">Selecione o tipo de fertilizante</option>
              <option value="Probióticos">Probióticos</option>
              <option value="Bokashi">Bokashi</option>
              <option value="Químico">Químico</option>
            </select>
          </label>
          {fertilizerType === 'Químico' && (
            <div>
              <label>Fertilizante Químico:
                <select
                  value={chemicalFertilizer}
                  onChange={(e) => setChemicalFertilizer(e.target.value)}
                  required >
                  <option value="">Selecione o fertilizante químico</option>
                  {fertilizers.map((fertilizer, index) => (
                    <option key={index} value={fertilizer}>{fertilizer}</option>
                  ))}
                  <option value="custom">Adicionar Fertilizante</option>
                </select>
              </label>

              {addNewFert && (
                <div className="popup">
                  <div className="popup-inner">
                    <label>Novo Fertilizante Químico:
                      <input
                        type="text"
                        value={customChemicalFertilizer}
                        onChange={(e) => setCustomChemicalFertilizer(e.target.value)}
                        required/>
                    </label>
                    <br />
                    <br />
                    <div className="bottom-buttons">
                      <button onClick={() => setAddNewFert(false)} className="cancel-button">Voltar</button>
                      <button onClick={() => saveFertilizersList(customChemicalFertilizer)}
                        className="first-class-button">
                        Confirmar</button>
                    </ div>
                  </div>
                </div>
              )}
            </div>
          )}

          <label>Quantidade Aplicada:
            <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </label>
          <br />
          <br />

          <div className="bottom-buttons">
            <button
              type="button"
              onClick={() => setShowFertilizationPopup(false)}
              className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="first-class-button">Salvar</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default FertilizationPopup;
