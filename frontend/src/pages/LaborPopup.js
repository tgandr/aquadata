import React, { useEffect, useState } from "react";
import '../styles/LaborPopup.css';

const LaborPopup = ({ setShowLaborPopup }) => {
    const [workersList, setWorkersList] = useState([]);
    const [showFormInd, setShowFormInd] = useState(false);
    const [worker, setWorker] = useState({
        month: '',
        name: '',
        salary: ''
    });
    const [addNewWorkerPopup, setAddNewWorkerPopup] = useState(false);
    const [addNewWorker, setAddNewWorker] = useState('');
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [monthsWithRegister, setMonthsWithRegister] = useState([]);
    const [showPreviousSalaries, setShowPreviousSalaries] = useState(false);

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const saveWorkerByMonth = (e) => {
        e.preventDefault()
        if (!worker.month || !worker.name || !worker.salary) {
            setErrorMessage("Por favor, preencha todos os campos.");
            return;
        }
        let financial = JSON.parse(localStorage.getItem('financial')) || {};
        const month = worker.month;
        const w = {
            name: worker.name,
            salary: worker.salary
        };
        if (financial) {
            if ('labor' in financial) {
                let monthFound = false;
                financial.labor.forEach((item, index) => {
                    if (item.month === month) {
                        monthFound = true;
                        if ('payroll' in item) {
                            financial.labor[index] = { ...item, payroll: [...item.payroll, w] };
                        } else {
                            financial.labor[index] = { ...item, payroll: [w] };
                        }}
                });
                if (!monthFound) {
                    financial.labor.push({ month: month, payroll: [w] });
                }} else {
                financial = { ...financial, labor: [{ month: month, payroll: [w] }] };
            }} else {
            financial = { labor: [{ month: month, payroll: [w] }] };
        }
        localStorage.setItem('financial', JSON.stringify(financial));
        updateMonthsWithRegister(financial);
        setWorker({
            ...worker,
            name: '',
            salary: ''
        });
        setShowFormInd(false);
        setShowPreviousSalaries(true);
        setErrorMessage('');
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    }

    useEffect(() => {
        if (worker.name === 'custom') {
            setAddNewWorkerPopup(true);
        } else {
            setAddNewWorkerPopup(false);
        }
    }, [worker]);

    useEffect(() => {
        const wList = JSON.parse(localStorage.getItem('financial')) || {};
        if (wList) {
            if ('workersList' in wList) {
                setWorkersList(wList.workersList)
            }
        };
        updateMonthsWithRegister(wList);
    }, []);

    const saveNewWorker = () => {
        const workerAdded = capitalizeProperly(addNewWorker);
        let financial = JSON.parse(localStorage.getItem('financial')) || {};
        if (financial) {
            if ('workersList' in financial) {
                financial.workersList.push(workerAdded);
            } else {
                financial = { ...financial, workersList: [workerAdded] };
            }
        } else {
            financial = { workersList: [workerAdded] };
        }
        localStorage.setItem('financial', JSON.stringify(financial));
        setWorkersList(financial.workersList)
        setAddNewWorker('');
        setWorker({
            ...worker,
            name: workerAdded,
            salary: ''
        });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    }

    const handleChange = (e) => {
        setWorker({ ...worker, [e.target.name]: e.target.value })
    }

    const capitalizeProperly = (str) => {
        const prepositions = ['de', 'da', 'do', 'das', 'dos'];
        return str
            .toLowerCase()
            .split(' ')
            .map((word, index) => {
                if (prepositions.includes(word) && index !== 0) {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    };

    const renderMonth = ({ month, sum }) => {
        const dateParts = month.split('-');
        const year = parseInt(dateParts[0]);
        const monthIndex = parseInt(dateParts[1]) - 1;
        if (year === 2024) {
            return { month: monthNames[monthIndex], year: year, sum: sum };
        }
    };

    const updateMonthsWithRegister = (financial) => {
        if (financial && 'labor' in financial) {
            const monthsWithRegister = financial.labor.map(m => {
                const sum = m.payroll.reduce((acc, i) => acc + parseFloat(i.salary), 0);
                return { month: m.month, sum: sum };
            });
            const mSorted = []
            for (let i = 0; i < monthNames.length; i++) {
                monthsWithRegister.forEach((m) => {
                    const dateParts = m.month.split('-');
                    const year = parseInt(dateParts[0]);
                    const monthIndex = parseInt(dateParts[1]) - 1;
                    if (year === 2024) {
                        if (monthIndex === i) {
                            mSorted.push(m)
                        }
                    }
                });
            }
            mSorted.length > 0 && setShowPreviousSalaries(true);
            setMonthsWithRegister(mSorted);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Folha de Pagamento</h3>
                <div className="result-box">
                    {showPreviousSalaries && (
                        <div className="year-payments">
                            <h3>Folha salarial - 2024</h3> {/* automatizar o ano */}
                            <div className="months">
                                {monthsWithRegister.map((month, index) => (
                                    <div key={index}>
                                        {renderMonth(month)?.month}: {"R$ " + renderMonth(month)?.sum.toLocaleString('pt-BR', 
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="bottom-buttons">
                    <button
                        onClick={() => setShowLaborPopup(false)}
                        className="cancel-button">
                        Voltar</button>
                    <button
                        onClick={() => setShowFormInd(true)}
                        className="first-class-button">Lançar valores</button>
                </div>
            </div>

            {showFormInd && (
                <div className="popup">
                    <div className="popup-inner">
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <form 
                        className="harv-form"
                        onSubmit={saveWorkerByMonth}>
                            <label>Mês:
                                <input
                                    type="month"
                                    name="month"
                                    onChange={handleChange}
                                    required />
                            </label>
                            <label>Funcionário:
                                <select name='name' value={worker.name} onChange={handleChange}>
                                    <option value="">Indique o funcionário ou total</option>
                                    {workersList.map((worker, index) => (
                                        <option key={index} value={worker}>{worker}</option>
                                    ))}
                                    <option value="total">Folha de pagamento total</option>
                                    <option value="custom">Adicionar funcionário</option>
                                </select>
                            </label>
                            <label>Valor:
                                <input
                                    type="number"
                                    name="salary"
                                    step="0.01"
                                    value={worker.salary}
                                    onChange={handleChange}
                                    required />
                            </label>
                            <br />
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    onClick={() => setShowFormInd(false)}
                                    className="cancel-button">Voltar</button>
                                <button
                                    type="submit"
                                    className="first-class-button">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {addNewWorkerPopup && (
                <div className="popup">
                    <div className="popup-inner">
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
            )}
            {showSavedMessage && <div className="saved-message">Salvo!</div>}

        </div>
    )
}

export default LaborPopup;
