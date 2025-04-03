import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatDate } from './utils';

const OthersPurchasePopup = ({ setShowPopup, handleChange, handleSubmit,
    base }) => {
    const [formOthers, setFormOthers] = useState({
        date: new Date().toISOString().split('T')[0],
        label: '',
        unity: '',
        quantity: '',
        value: ''
    });

    const purchases = base.financial
    const [showOthersPurchaseTable, setShowOthersPurchaseTable] = useState(false);

    useEffect(() => {
        // const storedPurchases = JSON.parse(localStorage.getItem('financial')) || {};
        const storedPurchases = base.financial
        // if (storedPurchases) {
        //     if ('othersPurchase' in storedPurchases) {
        //         setPurchases(storedPurchases);
        //     }
        // }
        if (storedPurchases.othersPurchase) {
            if (storedPurchases.othersPurchase.length > 0) {
                setShowOthersPurchaseTable(true);
            } else {
                setShowOthersPurchaseTable(false);
            }
        }
    }, [base.financial]);    

    const handleSubmitCheck = (e) => {
        e.preventDefault();
        handleSubmit(e, formOthers, setFormOthers, 'othersPurchase');
        resetForm();
    };

    const resetForm = () => {
        setFormOthers({
            date: new Date().toISOString().split('T')[0],
            label: '',
            unity: '',
            quantity: '',
            value: ''
        });
    };
    const handleDeletePurchase = (index) => {
        const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");
        if (isConfirmed) {
            const purchases = {...base.financial}
            const actualIndex = purchases.othersPurchase.length - 1 - index;
            const updatedPurchases = { ...purchases };
            const deletedPurchase = updatedPurchases.othersPurchase[actualIndex];

            updatedPurchases.othersPurchase.splice(actualIndex, 1);
            // localStorage.setItem('financial', JSON.stringify(updatedPurchases));
            base.db.put(updatedPurchases).then(res => {
                updatedPurchases._rev = res.rev
                base.setFinancial(updatedPurchases)
            })
            // setPurchases(updatedPurchases);

            // let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            let stockData = {...base.stock}
            if ('othersPurchase' in stockData) {
                stockData.othersPurchase = stockData.othersPurchase.filter(purchase => purchase.id !== deletedPurchase.id);
            }
            base.db.put(stockData).then(res => {
                stockData._rev = res.rev
                base.setStock(stockData)
            })
            // localStorage.setItem('stockData', JSON.stringify(stockData));
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Adicionar Outros</h3>
                <form onSubmit={handleSubmitCheck} className="harv-form">
                    <label>
                        Data da Compra:
                        <input
                            type="date"
                            name="date"
                            value={formOthers.date}
                            onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                            required />
                    </label>
                    <label>
                        Item:
                        <input
                            type="text"
                            name="label"
                            value={formOthers.label}
                            onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                            required />
                    </label>
                    <label>
                        Unidade:
                        <select
                            name="unity"
                            value={formOthers.unity}
                            onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                            required>
                            <option value="">Selecione</option>
                            <option value="unidade">Unidade</option>
                            <option value="kg">Kg</option>
                            <option value="g">g</option>
                            <option value="l">L</option>
                            <option value="m">m</option>
                            <option value="pacote">Pacote</option>
                        </select>
                    </label>
                    <label>
                        Quantidade:
                        <input
                            type="number"
                            name="quantity"
                            value={formOthers.quantity}
                            onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                            required />
                    </label>
                    <label>
                        Preço:
                        <input
                            type="number"
                            name="value"
                            value={formOthers.value}
                            onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                            required />
                    </label>

                    <p>Total: R$ {(formOthers.value * formOthers.quantity).toLocaleString('pt-BR',
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div className="buttons-box">
                        <button
                            type="button"
                            onClick={() => setShowPopup({ others: false })}
                            className="cancel-button">
                            Voltar
                        </button>
                        <button type="submit" className="first-class-button">
                            Salvar
                        </button>
                    </div>
                </form>
                <br />

                {showOthersPurchaseTable &&
                    <>
                        <table className="biometry-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Compra</th>
                                    <th>Excluir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.othersPurchase && purchases.othersPurchase.slice(-5).reverse().map((purchase, index) => (
                                    <tr key={purchase.id}>
                                        <td>{formatDate(purchase.date).date}</td>
                                        <td>{purchase.label} -<br /> R$ {(purchase.value * purchase.quantity).toLocaleString('pt-BR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                onClick={() => handleDeletePurchase(index)}
                                                className="delete-button">
                                                <i className="fas fa-trash" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>}
            </div>
        </div>
    );
};

export default OthersPurchasePopup;
