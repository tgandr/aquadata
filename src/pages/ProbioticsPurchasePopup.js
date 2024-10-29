import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatDate } from './utils';

const ProbioticsPurchasePopup = ({ showPopup, setShowPopup, capitalizeProperly, handleChange,
    handleSubmit, setShowSavedMessage, purchases, setPurchases, handleDeletePurchase }) => {
    const [addNewProbiotic, setAddNewProbiotic] = useState('');
    const [customProbiotic, setCustomProbiotic] = useState('');
    const [showProbioticsPurchasesTable, setShowProbioticsPurchasesTable] = useState(false);
    const [formProbiotic, setFormProbiotic] = useState({
        date: new Date().toISOString().split('T')[0],
        label: '',
        quantity: '',
        value: '',
        unity: ''
    });

    const [probiotics, setProbiotics] = useState([
        "Biotrends", "DB Aqua", "Phibro"]);

    const saveProbioticsList = (newProbiotic) => {
        const probiotic = capitalizeProperly(newProbiotic);
        if (newProbiotic !== '') {
            setProbiotics([...probiotics, probiotic]);
            setCustomProbiotic('');
            let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            if ('probioticsList' in stockData) {
                stockData.probioticsList.push(probiotic);
            } else {
                stockData.probioticsList = [...probiotics, probiotic];
            }
            localStorage.setItem('stockData', JSON.stringify(stockData));
        }
        setFormProbiotic({ ...formProbiotic, probiotico: probiotic });
        setAddNewProbiotic(false);
        setShowPopup({ ...showPopup, probiotics: true });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    };

    useEffect(() => {
        if (formProbiotic.label === 'custom') {
            setAddNewProbiotic(true);
        } else {
            setAddNewProbiotic(false);
        }
    }, [formProbiotic.label]);

    useEffect(() => {
        const checkLists = JSON.parse(localStorage.getItem('stockData')) || {};
        const financial = JSON.parse(localStorage.getItem('financial')) || {};
        const checkPurchases = financial.probioticsPurchase || [];
        setPurchases(financial);
        if ('probioticsList' in checkLists) {
            setProbiotics(checkLists.probioticsList);
        }
        if (checkPurchases.length > 0) {
            setShowProbioticsPurchasesTable(true);
        } else {
            setShowProbioticsPurchasesTable(false);
        }
    }, [formProbiotic]);

    return (
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h3>Adicionar Probiótico</h3>
                    <form
                        onSubmit={(e) => handleSubmit(e, formProbiotic, setFormProbiotic, 'probioticsPurchase')}
                        className="harv-form">
                        <label>
                            Data da Compra:
                            <input
                                type="date"
                                name="date"
                                value={formProbiotic.date}
                                onChange={(e) => handleChange(e, setFormProbiotic, formProbiotic)}
                                required />
                        </label>
                        <label>Probiótico:
                            <select
                                value={formProbiotic.label}
                                name="label"
                                onChange={(e) => handleChange(e, setFormProbiotic, formProbiotic)}
                                required>
                                <option value="">Selecione o probiótico</option>
                                {probiotics.map((probiotic, index) => (
                                    <option value={probiotic} key={index}>
                                        {probiotic}
                                    </option>
                                ))}
                                <option value="custom">Outro - Informar</option>
                            </select>
                        </label>
                        <label>
                            Quantidade:
                            <input
                                type="number"
                                name="quantity"
                                value={formProbiotic.quantity}
                                onChange={(e) => handleChange(e, setFormProbiotic, formProbiotic)}
                                required />
                        </label>
                        <label>
                            Unidade:
                            <select
                                value={formProbiotic.unity}
                                name="unity"
                                onChange={(e) => handleChange(e, setFormProbiotic, formProbiotic)}
                                required>
                                <option value="">Selecione</option>
                                <option value="quilo">Quilo</option>
                                <option value="litro">Litro</option>
                            </select>
                        </label>
                        <label>
                            Valor da compra:
                            <input
                                type="number"
                                name="value"
                                value={formProbiotic.value}
                                onChange={(e) => handleChange(e, setFormProbiotic, formProbiotic)}
                                required />
                        </label>
                        <p>Total: R$ {formProbiotic.value !== "" ? (`${(formProbiotic.value / formProbiotic.quantity).toLocaleString('pt-BR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${formProbiotic.unity}`) : `0,00`}
                            </p>
                        <div className="buttons-box">
                            <button
                                type="button"
                                onClick={() => setShowPopup({ ...showPopup, probiotics: false })}
                                className="cancel-button">
                                Voltar</button>
                            <button type="submit"
                                className="first-class-button">
                                Salvar</button>
                        </div>
                    </form>
                    <br />

                    {showProbioticsPurchasesTable && (
                        <table className="biometry-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Compra</th>
                                    <th>Excluir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.probioticsPurchase &&
                                    purchases.probioticsPurchase.slice(-5).reverse().map((purchase, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(purchase.date).date}</td>
                                            <td>{purchase.label} - <br /> {parseFloat(purchase.value).toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    onClick={() => handleDeletePurchase(purchase.id, 'probioticsPurchase')}
                                                    className="delete-button">
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            {addNewProbiotic &&
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Informar probiótico</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveProbioticsList(customProbiotic);
                            }}
                            className="harv-form">
                            <label>
                                Nome do probiótico:
                                <input
                                    type="text"
                                    name="probiotic"
                                    value={customProbiotic}
                                    onChange={(e) => setCustomProbiotic(e.target.value)}
                                    required />
                            </label>
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => (setAddNewProbiotic(false), setShowPopup({ ...showPopup, probiotics: true }))}
                                    className="cancel-button">
                                    Voltar</button>
                                <button type="submit"
                                    className="first-class-button">
                                    Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default ProbioticsPurchasePopup;
