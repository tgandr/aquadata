import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatDate } from './utils';


const FertilizersPurchasePopup = ({ showPopup, setShowPopup, capitalizeProperly, handleChange,
    handleSubmit, setShowSavedMessage, setPurchases }) => {
    const [addNewFert, setAddNewFert] = useState('');
    const [customChemicalFertilizer, setCustomChemicalFertilizer] = useState('');
    const [formFertilizer, setFormFertilizer] = useState({
        dataCompra: new Date().toISOString().split('T')[0],
        fertilizante: '',
        quantidade: '',
        preco: ''
    });

    const [fertilizers, setFertilizers] = useState([
        "NPK", "Fosfato Monopotássico", "Sulfato de Amônio"]);

    const [fertilizersPurchase, setFertilizersPurchase] = useState([]);

    const saveFertilizersList = (newFert) => {
        const fert = capitalizeProperly(newFert);
        if (newFert !== '') {
            setFertilizers([...fertilizers, fert]);
            setCustomChemicalFertilizer('');
            let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            if ('fertilizersList' in stockData) {
                stockData.fertilizersList.push(fert);
            } else {
                stockData.fertilizersList = [...fertilizers, fert];
            }
            localStorage.setItem('stockData', JSON.stringify(stockData));
        }
        setFormFertilizer({ ...formFertilizer, fertilizante: fert });
        setAddNewFert(false);
        setShowPopup({ ...showPopup, fertilizers: true });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    };

    useEffect(() => {
        if (formFertilizer.fertilizante === 'custom') {
            setAddNewFert(true);
        } else {
            setAddNewFert(false);
        }
    }, [formFertilizer.fertilizante]);

    const handleDeletePurchase = (index) => {
        const updatedPurchases = [...fertilizersPurchase];
        updatedPurchases.splice(index, 1);
        localStorage.setItem('financial', JSON.stringify({ ...JSON.parse(localStorage.getItem('financial')), fertilizersPurchase: updatedPurchases }));
        setFertilizersPurchase(updatedPurchases);
    };

    useEffect(() => {
        const checkLists = JSON.parse(localStorage.getItem('stockData')) || {};
        const checkPurchases = JSON.parse(localStorage.getItem('financial')) || {};
        setPurchases(checkPurchases);
        if ('fertilizersList' in checkLists) {
            setFertilizers(checkLists.fertilizersList);
        }
        const fertilizersPurchases = JSON.parse(localStorage.getItem('financial'))?.fertilizersPurchase || [];
        setFertilizersPurchase(fertilizersPurchases.slice(0, 5).reverse());
    }, [setPurchases, handleDeletePurchase]);

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
                                name="dataCompra"
                                value={formFertilizer.dataCompra}
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
                                required />
                        </label>
                        <label>Fertilizante:
                            <select
                                value={formFertilizer.fertilizante}
                                name="fertilizante"
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
                                name="quantidade"
                                value={formFertilizer.quantidade}
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
                                required />
                        </label>
                        <label>
                            Valor:
                            <input
                                type="number"
                                name="preco"
                                value={formFertilizer.preco}
                                onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}
                                required />
                        </label>
                        <p>Total: R$ {(formFertilizer.preco * formFertilizer.quantidade).toLocaleString('pt-BR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                    <table className="biometry-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Compra</th>
                                {/* <th>Quantidade</th> */}
                                {/* <th>Total</th> */}
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fertilizersPurchase.map((purchase, index) => (
                                <tr key={index}>
                                    <td>{formatDate(purchase.dataCompra).date}</td>
                                    <td>{purchase.fertilizante} - <br /> {(purchase.quantidade * purchase.preco).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}</td>
                                    {/* <td>{purchase.quantidade}</td> */}
                                    {/* <td>{(purchase.quantidade * purchase.preco).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</td> */}
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

