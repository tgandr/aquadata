import React, { useState, useEffect } from 'react';
import RationPurchasesPopup from './RationPurchasesPopup';

const Purchases = ({ setShowPurchasesPopup }) => {
    const [showRationPurchasesPopup, setShowRationPurchasesPopup] = useState(false);
    const [addNewFert, setAddNewFert] = useState('');
    const [customChemicalFertilizer, setCustomChemicalFertilizer] = useState('');
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const [showPopup, setShowPopup] = useState({
        probiotics: false,
        fertilizers: false,
        others: false
    });

    const [formProbiotics, setFormProbiotics] = useState({
        dataCompra: '',
        fornecedor: '',
        quantidade: '',
        preco: ''
    });

    const [formFertilizer, setFormFertilizer] = useState({
        dataCompra: '',
        fertilizante: '',
        quantidade: '',
        valor: ''
    });

    const [formOthers, setFormOthers] = useState({
        dataCompra: '',
        item: '',
        quantidade: '',
        unidade: ''
    });

    const saveStockDataToLocalStorage = (data) => {
        localStorage.setItem('financial', JSON.stringify(data));
    };

    const purchases = JSON.parse(localStorage.getItem('financial')) || {};

    const handleChange = (e, formSetter, form) => {
        formSetter({ ...form, [e.target.name]: e.target.value });
        console.log(form)
        console.log(e.target)
    };

    const handleSubmit = (e, form, formSetter, category) => {
        e.preventDefault();

        if (!purchases[category]) {
            purchases[category] = [];
        }
        const updatedPurchases = { ...purchases, [category]: [...purchases[category], form] };
        console.log(updatedPurchases)
        // setStockData(updatedStockData);
        saveStockDataToLocalStorage(updatedPurchases);
        setShowPopup({ probiotics: false, fertilizers: false, others: false });
        // switchRationScreen(true, true);
        formSetter({
            fornecedor: '',
            quantidade: '',
            preco: '',
            fertilizante: '',
            quantidade: '',
            valor: '',
            item: '',
            unidade: ''
        });
    };

    const [fertilizers, setFertilizers] = useState([
        "NPK",
        "Fosfato Monopotássico",
        "Sulfato de Amônio"
    ]);

    const saveFertilizersList = (newFert) => {
        const fert = capitalizeProperly(newFert);
        console.log(addNewFert);
        console.log(customChemicalFertilizer);
        if (newFert != '') {
            setFertilizers([...fertilizers, fert]);
            // setChemicalFertilizer(newFert);
            setCustomChemicalFertilizer('');
            let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            if ('fertilizersList' in stockData) {
                stockData.fertilizersList.push(fert);
            } else {
                stockData.fertilizersList = [...fertilizers, fert]
            }
            localStorage.setItem('stockData', JSON.stringify(stockData));
        }
        setFormFertilizer({ ...formFertilizer, fertilizante: fert })
        setAddNewFert(false);
        setShowPopup({ ...showPopup, fertilizers: true });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
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

    useEffect(() => {
        if (formFertilizer.fertilizante === 'custom') {
            setAddNewFert(true);
            setShowPopup({ ...showPopup, fertilizers: false })
            console.log(formFertilizer.fertilizante)
        } else {
            setAddNewFert(false);
        }
    }, [formFertilizer.fertilizante]);

    return (
        <div>
            <div className="popup">
                <div className="popup-inner">
                    <h3>Compras</h3>
                    <div className="purchases-buttons-container">
                        <button onClick={() => setShowRationPurchasesPopup(true)}
                            className="purchases-buttons">Ração</button>
                        <button onClick={() => setShowPopup({ ...showPopup, probiotics: true })}
                            className="purchases-buttons">Probióticos</button>
                        <button onClick={() => setShowPopup({ ...showPopup, fertilizers: true })}
                            className="purchases-buttons">Fertilizantes</button>
                        <button onClick={() => setShowPopup({ ...showPopup, others: true })}
                            className="purchases-buttons">Outros</button>
                        {/* <button onClick={() => setShowPurchasesPopup(false)}>Voltar</button> */}
                    </div>
                    <br />
                    <button className="purchases-buttons-back" onClick={() => setShowPurchasesPopup(false)}>

                        <span>Voltar</span>
                    </button>
                </div>
            </div>

            {showRationPurchasesPopup &&
                <RationPurchasesPopup setShowRationPurchasesPopup={setShowRationPurchasesPopup} />}

            {showPopup.probiotics && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Adicionar Probióticos</h3>
                        <form
                            onSubmit={(e) => handleSubmit(e, formProbiotics, setFormProbiotics, 'probioticsPurchase')}
                            className="harv-form">
                            <label>
                                Data da Compra:
                                <input type="date" name="dataCompra" value={formProbiotics.dataCompra} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required />
                            </label>
                            <label>
                                Fornecedor:
                                <select name="fornecedor" value={formProbiotics.fornecedor} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required>
                                    <option value="">Selecione</option>
                                    <option value="Biotrends">Biotrends</option>
                                    <option value="Phibro">Phibro</option>
                                    <option value="DB Aqua">DB Aqua</option>
                                    <option value="Outro">Outro - Informar</option>
                                </select>
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={formProbiotics.quantidade} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required />
                            </label>
                            <label>
                                Preço:
                                <input
                                    type="number"
                                    name="preco"
                                    value={formProbiotics.preco} onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)} required />
                            </label>
                            <br />
                            <br />
                            <br />
                            <div className="bottom-buttons">
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
                    </div>
                </div>
            )}

            {showPopup.fertilizers && (
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
                                        value={formFertilizer.dataCompra} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
                                </label>
                                {/* <label>
                                Fertilizante:
                                <input
                                    type="text"
                                    name="fertilizante"
                                    value={formFertilizer.fertilizante} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
                            </label> */}
                                <label>Fertilizante:
                                    <select
                                        value={formFertilizer.fertilizante}
                                        name="fertilizante"
                                        onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)}>
                                        <option value="">Selecione o fertilizante químico</option>
                                        {fertilizers.map((fertilizer, index) => (
                                            <option key={index} value={fertilizer}>{fertilizer}</option>
                                        ))}
                                        <option value="custom">Adicionar Fertilizante</option>
                                    </select>
                                </label>
                                <label>
                                    Quantidade:
                                    <input
                                        type="number"
                                        name="quantidade"
                                        value={formFertilizer.quantidade} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
                                </label>
                                <label>
                                    Valor:
                                    <input
                                        type="number"
                                        name="valor"
                                        value={formFertilizer.valor} onChange={(e) => handleChange(e, setFormFertilizer, formFertilizer)} required />
                                </label>
                                <br />
                                <br />
                                <br />
                                <div className="bottom-buttons">
                                    <button
                                        type="button"
                                        onClick={() => setShowPopup({ ...showPopup, fertilizers: false })}
                                        className="cancel-button">
                                        Voltar</button>
                                    <button
                                        type="submit"
                                        className="first-class-button">
                                        Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </>
            )}

            {addNewFert && (
                <div className="popup">
                    <div className="popup-inner">
                        <label>Novo Fertilizante Químico:
                            <input
                                type="text"
                                value={customChemicalFertilizer}
                                onChange={(e) => setCustomChemicalFertilizer(e.target.value)}
                            />
                        </label>
                        <br />
                        <br />
                        <br />
                        <div className="bottom-buttons">
                            <button
                                onClick={() => (setAddNewFert(false), setShowPopup({ ...showPopup, fertilizers: true }))}
                                className="cancel-button">
                                Voltar</button>
                            <button onClick={() => saveFertilizersList(customChemicalFertilizer)}
                                className="first-class-button">
                                Confirmar</button>
                        </ div>
                    </div>
                </div>
            )}

            {showPopup.others && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Adicionar Insumo</h3>
                        <form
                            onSubmit={(e) => handleSubmit(e, formOthers, setFormOthers, 'othersPurchase')}
                            className="harv-form">
                            <label>
                                Data da Compra:
                                <input
                                    type="date"
                                    name="dataCompra"
                                    value={formOthers.dataCompra} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required />
                            </label>
                            <label>
                                Item:
                                <input
                                    type="text"
                                    name="item"
                                    value={formOthers.item} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required />
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={formOthers.quantidade} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required />
                            </label>
                            <label>
                                Unidade:
                                <select name="unidade" value={formOthers.unidade} onChange={(e) => handleChange(e, setFormOthers, formOthers)} required>
                                    <option value="">Selecione</option>
                                    <option value="kg">kg</option>
                                    <option value="L">L</option>
                                    <option value="unidade">unidade</option>
                                </select>
                            </label>
                            <br />
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => setShowPopup({ ...showPopup, others: false })}
                                    className="cancel-button">
                                    Voltar</button>
                                <button
                                    type="submit"
                                    className="first-class-button">
                                    Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {showSavedMessage && <div className="saved-message">Salvo!</div>}

        </div>
    )

}

export default Purchases;