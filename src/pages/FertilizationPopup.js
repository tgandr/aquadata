import React, { useState, useEffect } from 'react';

const FertilizationPopup = ({ setShowFertilizationPopup }) => {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [fertilizerType, setFertilizerType] = useState('');
  const [chemicalFertilizer, setChemicalFertilizer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customChemicalFertilizer, setCustomChemicalFertilizer] = useState('');
  const [fertilizers, setFertilizers] = useState([
    "NPK",
    "Fosfato Monopotássico",
    "Sulfato de Amônio"
    // Adicione mais fertilizantes conforme necessário
  ]);

  const handleSave = () => {
    // Aqui você pode fazer algo com os dados, como enviar para o servidor
    // ou passar de volta para o componente pai
    console.log('Data:', data);
    console.log('Tipo de Fertilizante:', fertilizerType);
    console.log('Fertilizante Químico:', chemicalFertilizer || customChemicalFertilizer);
    console.log('Quantidade:', quantity);

    // Atualiza o array de fertilizantes se o usuário adicionou um novo
    if (fertilizerType === 'Químico' && customChemicalFertilizer) {
      setFertilizers(prevFertilizers => [...prevFertilizers, customChemicalFertilizer]);
    }

    // Fechar o popup
    setShowFertilizationPopup(false);
  };

  const saveFertilzersList = (newFert) => {
    let fertilizersList = JSON.parse(localStorage.getItem('fertilizersList'));
    if (fertilizersList) {
        fertilizersList.push(newFert);
    } else {
        fertilizersList = [...fertilizers, newFert]
    }
    localStorage.setItem('fertilizersList', JSON.stringify(fertilizersList));
  }

  useEffect(() => {
    const checkFertilizersList = JSON.parse(localStorage.getItem('fertilizersList'));
    checkFertilizersList && setFertilizers(checkFertilizersList)
  }, []); 

  return (
    <div className="popup">
      <div className="popup-content">
        {/* <span className="close" onClick={setShowFertilizationPopup}>&times;</span> */}
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
              {fertilizers.map(fertilizer => (
                <option key={fertilizer} value={fertilizer}>{fertilizer}</option>
              ))}
              <option value="custom">Adicionar Fertilizante</option>
            </select>
            {chemicalFertilizer === 'custom' && (
              <div>
                <label>Novo Fertilizante Químico:</label>
                <input type="text" value={customChemicalFertilizer} onChange={(e) => setCustomChemicalFertilizer(e.target.value)} />
                <button onClick={() =>
                    (setFertilizers([...fertilizers, customChemicalFertilizer]),
                    setChemicalFertilizer(customChemicalFertilizer),
                    saveFertilzersList(customChemicalFertilizer),
                    setCustomChemicalFertilizer('')
                    )}>Confirmar</button>
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
