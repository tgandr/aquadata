import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatDate } from './utils';

const OthersPurchasePopup = ({ setShowPopup, handleChange, handleSubmit, purchases, 
    setPurchases, handleDeletePurchase }) => {
    const [formOthers, setFormOthers] = useState({
        date: new Date().toISOString().split('T')[0],
        label: '',
        unity: '',
        quantity: '',
        value: ''
    });
    const [showOthersPurchaseTable, setShowOthersPurchaseTable] = useState(false);

    useEffect(() => {
        const storedPurchases = JSON.parse(localStorage.getItem('financial')) || {};
        if (storedPurchases) {
            if ('othersPurchase' in storedPurchases) {
                setPurchases(storedPurchases);
            }
        }
        if (storedPurchases.othersPurchase) {
            if (storedPurchases.othersPurchase.length > 0) {
                setShowOthersPurchaseTable(true);
            } else {
                setShowOthersPurchaseTable(false);
            }
        }
    }, [formOthers]);

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
                                {purchases.othersPurchase && purchases.othersPurchase.slice(-5).reverse().map((purchase) => (
                                    <tr key={purchase.id}>
                                        <td>{formatDate(purchase.date).date}</td>
                                        <td>{purchase.label} -<br /> R$ {(purchase.value * purchase.quantity).toLocaleString('pt-BR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                onClick={() => handleDeletePurchase(purchase.id, 'othersPurchase')}
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
