import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatDate } from './utils';


const FertilizersPurchasePopup = ({ showPopup, setShowPopup, capitalizeProperly, handleChange,
    handleSubmit, setShowSavedMessage, base }) => {
    const [addNewFert, setAddNewFert] = useState('');
    const [customChemicalFertilizer, setCustomChemicalFertilizer] = useState('');
    const [showFertilizerPurchasesTable, setShowFertilizerPurchasesTable] = useState(false);
    const [formFertilizer, setFormFertilizer] = useState({
        date: new Date().toISOString().split('T')[0],
        label: '',
        quantity: '',
        value: '',
        unity: ''
    });
    const purchases = base.financial
    const [fertilizers, setFertilizers] = useState([
        "NPK", "Fosfato Monopotássico", "Sulfato de Amônio"]);

    const saveFertilizersList = (newFert) => {
        const fert = capitalizeProperly(newFert);
        if (newFert !== '') {
            setFertilizers([...fertilizers, fert]);
            setCustomChemicalFertilizer('');
            // let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            const stockData = base.stock
            if ('fertilizersList' in stockData) {
                stockData.fertilizersList.push(fert);
            } else {
                stockData.fertilizersList = [...fertilizers, fert];
            }
            // localStorage.setItem('stockData', JSON.stringify(stockData));
            base.db.put(stockData).then(res => {
                stockData._rev = res.reverse
                base.setStock(stockData)
            })
        }
        setFormFertilizer({ ...formFertilizer, label: fert });
        setAddNewFert(false);
        setShowPopup({ ...showPopup, fertilizers: true });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    };

    useEffect(() => {
        if (formFertilizer.label === 'custom') {
            setAddNewFert(true);
        } else {                   
            setAddNewFert(false);
        }                                              
    }, [formFertilizer.label]);                                                                                                                                                                          

    useEffect(() => {
        // const checkLists = JSON.parse(localStorage.getItem('stockData')) || {};
        const checkLists = base.stock
        // const financial = JSON.parse(localStorage.getItem('financial')) || {};
        const checkPurchases = base.financial.fertilizersPurchase || [];
        // setPurchases(financial);
        if ('fertilizersList' in checkLists) {
            setFertilizers(checkLists.fertilizersList);
        }
        if (checkPurchases.length > 0) {
            setShowFertilizerPurchasesTable(true);
        } else {
            setShowFertilizerPurchasesTable(false);
        }
    }, [base.financial]);

    const handleDeletePurchase = (index) => {
        const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");
        if (isConfirmed) {
            const purchases = {...base.financial}
            const actualIndex = purchases.fertilizersPurchase.length - 1 - index;
            const updatedPurchases = { ...purchases };
            const deletedPurchase = updatedPurchases.fertilizersPurchase[actualIndex];

            updatedPurchases.fertilizersPurchase.splice(actualIndex, 1);
            // localStorage.setItem('financial', JSON.stringify(updatedPurchases));
            base.db.put(updatedPurchases).then(res => {
                updatedPurchases._rev = res.rev
                base.setFinancial(updatedPurchases)
            })
            // setPurchases(updatedPurchases);

            // let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            let stockData = {...base.stock}
            if ('fertilizersPurchase' in stockData) {
                stockData.fertilizersPurchase = stockData.fertilizersPurchase.filter(purchase => purchase.id !== deletedPurchase.id);
            }
            base.db.put(stockData).then(res => {
                stockData._rev = res.rev
                base.setStock(stockData)
            })
            // localStorage.setItem('stockData', JSON.stringify(stockData));
        }
    }
    return (
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h3>Adicionar Fertilizante</h3>
                    <form
                        onSubmit={(e) => handleSubmit(e, formFertilizer, setFormFertilizer, 'fertilizersPurchase')}
                        className="harv-form">
                        <label>
                            Data da Compra:
                            <input
                                type="date"
                                name="date"
                                value={formFertilizer.date}
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
                                required />
                        </label>
                        <label>Fertilizante:
                            <select
                                value={formFertilizer.label}
                                name="label"
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
                                required>
                                <option value="">Selecione o fertilizante químico</option>
                                {fertilizers.map((fertilizer, index) => (
                                    <option value={fertilizer} key={index}>
                                        {fertilizer}
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
                                value={formFertilizer.quantity}
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
                                required />
                        </label>
                        <label>
                            Unidade:
                            <select
                                value={formFertilizer.unity}
                                name="unity"
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
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
                                value={formFertilizer.value}
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
                                required />
                        </label>
                        {/* <p>Total: R$ {(formFertilizer.value * formFertilizer.quantity).toLocaleString('pt-BR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> */}
                        <p>Total: R$ {formFertilizer.value !== "" ? (`${(formFertilizer.value / formFertilizer.quantity).toLocaleString('pt-BR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${formFertilizer.unity}`) : `0,00`}
                            </p>
                        <div className="buttons-box">
                            <button
                                type="button"
                                onClick={() => setShowPopup({ ...showPopup, fertilizers: false })}
                                className="cancel-button">
                                Voltar</button>
                            <button type="submit"
                                className="first-class-button">
                                Salvar</button>
                        </div>
                    </form>
                    <br />
                    
                    {showFertilizerPurchasesTable && (
                        <table className="biometry-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Compra</th>
                                    <th>Excluir</th>
                                </tr>
                            </thead> 
                            <tbody>
                                {purchases.fertilizersPurchase &&
                                    purchases.fertilizersPurchase.slice(-5).reverse().map((purchase, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(purchase.date).date}</td>
                                            <td>{purchase.label} - <br /> {parseFloat(purchase.value).toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}</td>
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
                    )}
                </div>
            </div>

            {addNewFert &&
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Informar fertilizante químico</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveFertilizersList(customChemicalFertilizer);
                            }}
                            className="harv-form">
                            <label>
                                Nome do fertilizante:
                                <input
                                    type="text"
                                    name="fertilizer"
                                    value={customChemicalFertilizer}
                                    onChange={(e) => setCustomChemicalFertilizer(e.target.value)}
                                    required />
                            </label>
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => (setAddNewFert(false), setShowPopup({ ...showPopup, fertilizers: true }))}
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

export default FertilizersPurchasePopup;
