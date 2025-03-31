import React, { useState, useEffect } from 'react';
import { formatDate } from './utils';

const FertilizationPopup = ({ setShowFertilizationPopup, saveData,database }) => {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [stockData, setStockData] = useState()
  const [fertilizerType, setFertilizerType] = useState('');
  const [chemicalFertilizer, setChemicalFertilizer] = useState('');
  const [probiotic, setProbiotic] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('quilo'); // Default unit
  const [type, setType] = useState('');
  const [fertilizers, setFertilizers] = useState([]);
  const [probiotics, setProbiotics] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [dataToSave, setDataToSave] = useState({}); // Estado para armazenar dados
  const [remainingQuantity, setRemainingQuantity] = useState(0); // Estado para armazenar quantidade restante

  useEffect(() => {
    // const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
    database.find({
      selector: {
        dataType: 'stockData'
      }
    }).then(res => {
      if (!res.docs.lenght) return 

      const stock = res.docs[0]
      setStockData(res.docs[0])
      const fertilizersList = stock.fertilizersPurchase || [];
      const probioticsList = stock.probioticsPurchase || [];
  
      setFertilizers(fertilizersList.map(f => ({
        label: f.label,
        date: f.date,
        id: f.id,
        quantity: f.quantity // Incluindo a quantidade disponível
      })));
      setProbiotics(probioticsList.map(p => ({
        label: p.label,
        date: p.date,
        id: p.id,
        quantity: p.quantity // Incluindo a quantidade disponível
      })));
    })
    // Filtrando e removendo duplicatas
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    const quantityNumber = parseFloat(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      alert('Por favor, insira uma quantidade válida.');
      return;
    }

    const conversionRates = {
      'quilo': 1,
      'grama': 0.001,
      'litro': 1 
    };
    const convertedQuantity = quantityNumber * conversionRates[unit];
    
    let newDataToSave = {};
    let newRemainingQuantity = 0;

    if (fertilizerType === 'Probióticos') {
      const probioticItem = stockData.probioticsPurchase.find(p => p.label === probiotic);
      if (probioticItem) {
        if (convertedQuantity > probioticItem.quantity) {
          alert('Quantidade excede o estoque disponível para este probiótico.');
          return;
        }
        probioticItem.quantity -= convertedQuantity;
        localStorage.setItem('stockData', JSON.stringify(stockData));

        newDataToSave = {
          data: data,
          tipoFertilizante: fertilizerType,
          fertilizanteQuimico: probiotic,
          quantidade: quantity,
          unidade: unit,
          id: probioticItem.id
        };
        setType(probioticItem.unity);
        newRemainingQuantity = probioticItem.quantity;
      }
    } else if (fertilizerType === 'Químico') {
      const fertilizerItem = stockData.fertilizersPurchase.find(f => f.label === chemicalFertilizer);
      if (fertilizerItem) {
        if (convertedQuantity > fertilizerItem.quantity) {
          alert('Quantidade excede o estoque disponível para este fertilizante químico.');
          return;
        }
        fertilizerItem.quantity -= convertedQuantity;
        localStorage.setItem('stockData', JSON.stringify(stockData));

        newDataToSave = {
          data: data,
          tipoFertilizante: fertilizerType,
          fertilizanteQuimico: chemicalFertilizer,
          quantidade: quantity,
          unidade: unit,
          id: fertilizerItem.id // Incluindo o ID do fertilizante químico
        };
        setType(fertilizerItem.unity);
        newRemainingQuantity = fertilizerItem.quantity;
      }
    }

    if (fertilizerType === 'Químico' && chemicalFertilizer && !fertilizers.find(f => f.label === chemicalFertilizer)) {
      setFertilizers(prevFertilizers => [...prevFertilizers, { label: chemicalFertilizer, date: data, quantity: convertedQuantity }]);
    }

    setDataToSave(newDataToSave);
    setRemainingQuantity(newRemainingQuantity);
    setShowConfirmPopup(true);
  };

  const handleConfirm = () => {
    saveData(dataToSave, 'fertilizers');
    setShowFertilizationPopup(false);
    setShowConfirmPopup(false);
  };

  const handleEdit = () => {
    setShowConfirmPopup(false);
  };

  return (
    <>
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
                    onChange={(e) => (setChemicalFertilizer(e.target.value))}
                    required >
                    <option value="">Selecione o fertilizante químico</option>
                    {fertilizers.map((fertilizer, index) => (
                      <option key={index} value={fertilizer.label}>
                        {fertilizer.label} - Data: {formatDate(fertilizer.date).date}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {fertilizerType === 'Probióticos' && (
              <div>
                <label>Escolha o Probiótico:
                  <select
                    value={probiotic}
                    onChange={(e) => setProbiotic(e.target.value)}
                    required >
                    <option value="">Selecione o probiótico</option>
                    {probiotics.map((probiotic, index) => (
                      <option key={index} value={probiotic.label}>
                        {probiotic.label} - Data: {formatDate(probiotic.date).date}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <label>Quantidade Aplicada:
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </label>

            <label>Unidade:
              <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                <option value="quilo">Quilo</option>
                <option value="grama">Grama</option>
                <option value="litro">Litro</option>
              </select>
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

      {showConfirmPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Confirmação</h2>
            <p><strong>Data:</strong> {formatDate(data).date}</p>
            <p><strong>Tipo de Fertilizante:</strong> {fertilizerType}</p>
            {fertilizerType === 'Probióticos' && (
              <p><strong>Probiótico:</strong> {probiotic}</p>
            )}
            {fertilizerType === 'Químico' && (
              <p><strong>Fertilizante Químico:</strong> {chemicalFertilizer}</p>
            )}
            <p><strong>Quantidade:</strong> {quantity}</p>
            <p><strong>Unidade:</strong> {unit}</p>
            <p><strong>Quantidade Restante:</strong> {remainingQuantity.toLocaleString("pt-BR",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )} {type}</p>
            <br /><br />
            <div className="bottom-buttons">
              <button onClick={handleEdit} className="cancel-button">Editar</button>
              <button onClick={handleConfirm} className="first-class-button">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FertilizationPopup;
