import React, { useEffect, useState } from "react";
import '../styles/LaborPopup.css';

const LaborPopup = ({ setShowLaborPopup, setLaborTotalByMonth, setLaborMonth }) => {
    const [laborFormTot, setLaborFormTot] = useState({
        month: '',
        value:  ''
    });
    const [workersList, setWorkersList] = useState([]);
    const [showFormTot, setShowFormTot] = useState(false);
    const [showFormInd, setShowFormInd] = useState(false);
    const [worker, setWorker] = useState({
        name: '',
        salary: ''
    });
    const [addNewWorkerPopup, setAddNewWorkerPopup] = useState(false);
    const [addNewWorker, setAddNewWorker] = useState('');
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const saveTotal = () => {
        setShowFormTot(false);
        let financial = JSON.parse(localStorage.getItem('financial'));
        if (financial) {
            if ('labor' in financial) {
                financial.labor.push(laborFormTot);
            } else {
                financial = { ...financial, labor: [laborFormTot] };
            }
        } else {
            financial = { labor: [laborFormTot] };
        }
        localStorage.setItem('financial', JSON.stringify(financial));
    }

    useEffect(() => {
        if (worker === 'custom') {
            setAddNewWorkerPopup(true);
        } 
        // else {
        //     setAddNewWorkerPopup(false);
        // }
    }, [worker]);

    useEffect(() => {
        const wList = JSON.parse(localStorage.getItem('financial'));
        if (wList) {
            if ('workersList' in wList) {
                setWorkersList(wList.workersList)
            }}
    }, []);

    const saveNewWorker = () => {
        console.log(addNewWorker)
        let financial = JSON.parse(localStorage.getItem('financial'));
        if (financial) {
            if ('workersList' in financial) {
                financial.workersList.push(addNewWorker);
            } else {
                financial = { ...financial, workersList: [addNewWorker] };
            }
        } else {
            financial = { workersList: [addNewWorker] };
        }
        localStorage.setItem('financial', JSON.stringify(financial));
        setWorkersList(financial.workersList)
        setAddNewWorker('');
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
        console.log(workersList)
    }

    return (
        <div className="popup">
          <div className="popup-content">
            <h3>Folha de Pagamento</h3>
                <div>
                    <button onClick={() => setShowFormTot(true)}>Lançamento total</button>
                    <button onClick={() => setShowFormInd(true)}>Lançamento individual</button>
                </div>
                <button onClick={() => setShowLaborPopup(false)} >Cancelar</button>
          </div>

          {showFormTot && (
            <div className="popup">
                <div className="popup-content">
                    <label>Mês:</label>
                        <input 
                            type="month"
                            name="month"
                            onChange={(e) => setLaborFormTot({... laborFormTot, month: e.target.value})}
                            required />
                    <label>Valor:</label>
                        <input 
                            type="number"
                            name="value"
                            step="0.01"
                            onChange={(e) => setLaborFormTot({... laborFormTot, value: e.target.value})}
                            required />
                    <button onClick={() => saveTotal()}>Salvar</button>
                    <button onClick={() => setShowFormTot(false)}>Cancelar</button>
                </div>
            </div>
          )}

          {showFormInd && (
            <div className="popup">
                <div className="popup-content">
                    <label>Funcionário:</label>
                    <select value={worker} onChange={(e) => setWorker(e.target.value)}>
                        <option value="">Indique o Funcionário</option>
                        {workersList.map((worker, index) => (
                            <option key={index} value={worker}>{worker}</option>
                        ))}
                        <option value="custom">Adicionar funcionário</option>
                    </select>
                    <label>Valor:</label>
                        <input 
                            type="number"
                            name="value"
                            step="0.01"
                            // onChange={(e) => setLaborFormTot({... laborFormTot, value: e.target.value})}
                            required />
                    <button>Salvar</button>
                    <button onClick={() => setShowFormInd(false)}>Voltar</button>
                </div>
            </div>
          )}

          {addNewWorkerPopup && (
            <div className="popup">
                <div className="popup-content">
                <label>Novo funcionário:</label>
                  <input
                    type="text"
                    value={addNewWorker}
                    onChange={(e) => setAddNewWorker(e.target.value)}
                  />
                  <button onClick={() => saveNewWorker()}>Confirmar</button>
                  <button onClick={() => setAddNewWorkerPopup(false)}>Voltar</button>
                </div>
            </div>
          ) 

          }
          {showSavedMessage && (
            <div className="saved-message">Salvo!</div>
          )}      
        </div>
    )
}

export default LaborPopup;
