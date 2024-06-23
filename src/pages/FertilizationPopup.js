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

  const handleSave = () => {
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
        let fertilizersList = JSON.parse(localStorage.getItem('fertilizersList'));
        if (fertilizersList) {
            fertilizersList.push(newFert);
        } else {
            fertilizersList = [...fertilizers, newFert]
        }
    localStorage.setItem('fertilizersList', JSON.stringify(fertilizersList));
    }
  }

  useEffect(() => {
    const checkFertilizersList = JSON.parse(localStorage.getItem('fertilizersList'));
    if (checkFertilizersList) {
      setFertilizers(checkFertilizersList);
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
        <label>Data:</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        <label>Tipo de Fertilizante:</label>
        <select value={fertilizerType} onChange={(e) => setFertilizerType(e.target.value)}>
          <option value="">Selecione o tipo de fertilizante</option>
          <option value="Probióticos">Probióticos</option>
          <option value="Bokashi">Bokashi</option>
          <option value="Químico">Químico</option>
        </select>
        {fertilizerType === 'Químico' && (
          <div>
            <label>Fertilizante Químico:</label>
            <select value={chemicalFertilizer} onChange={(e) => setChemicalFertilizer(e.target.value)}>
              <option value="">Selecione o fertilizante químico</option>
              {fertilizers.map((fertilizer, index) => (
                <option key={index} value={fertilizer}>{fertilizer}</option>
              ))}
              <option value="custom">Adicionar Fertilizante</option>
            </select>

            {addNewFert && (
              <div className="popup">
                <div className="popup-inner">
                  <label>Novo Fertilizante Químico:</label>
                  <input
                    type="text"
                    value={customChemicalFertilizer}
                    onChange={(e) => setCustomChemicalFertilizer(e.target.value)}
                  />
                  <button onClick={() => saveFertilizersList(customChemicalFertilizer)}>Confirmar</button>
                  <button onClick={() => setAddNewFert(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}

        <label>Quantidade Aplicada:</label>
        <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button onClick={handleSave}>Salvar</button>
        <button onClick={() => setShowFertilizationPopup(false)}>Cancelar</button>
      </div>
    </div>
  );
};

export default FertilizationPopup;
