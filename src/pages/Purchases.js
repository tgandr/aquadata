import React, { useState, useEffect } from 'react';
import RationPurchasesPopup from './RationPurchasesPopup';
import { formatDate } from './utils';
import PostLarvaePurchasePopup from './PostLarvaePurchasePopup';

const Purchases = ({ setShowPurchasesPopup }) => {
    const [showRationPurchasesPopup, setShowRationPurchasesPopup] = useState(false);
    const [addNewFert, setAddNewFert] = useState('');
    const [customChemicalFertilizer, setCustomChemicalFertilizer] = useState('');
    const [showSavedMessage, setShowSavedMessage] = useState(false); // enviar via props
    const [purchases, setPurchases] = useState([]);

    const [showPopup, setShowPopup] = useState({
        probiotics: false,
        fertilizers: false,
        others: false,
        postLarvae: false
    });

    const [formProbiotics, setFormProbiotics] = useState({
        dataCompra: new Date().toISOString().split('T')[0],
        fornecedor: '',
        quantidade: '',
        preco: ''
    });

    const [formFertilizer, setFormFertilizer] = useState({
        dataCompra: new Date().toISOString().split('T')[0],
        fertilizante: '',
        quantidade: '',
        preco: ''
    });

    const [formOthers, setFormOthers] = useState({
        dataCompra: new Date().toISOString().split('T')[0],
        item: '',
        quantidade: '',
        unidade: '',
        preco: ''
    });

    const savePurchase = (data) => {
        localStorage.setItem('financial', JSON.stringify(data));
    };

    const saveStock = (category, toUpdate) => {
        let stock = JSON.parse(localStorage.getItem('stockData')) || {};
        if (category in stock) {
            stock[category].push(toUpdate);
        } else {
            stock = { ...stock, [category]: [toUpdate] }
        }
        localStorage.setItem('stockData', JSON.stringify(stock));
    }

    const handleChange = (e, formSetter, form) => {
        formSetter({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e, form, formSetter, category) => {
        e.preventDefault();

        if (!purchases[category]) {
            purchases[category] = [];
        }
        const keys = Object.keys(form);
        let resetForm = {};
        keys.forEach((key) => (key !== 'dataCompra' && (resetForm = { ...resetForm, [key]: '' })))
        resetForm = { ...resetForm, dataCompra: form.dataCompra }
        const updatedPurchases = { ...purchases, [category]: [...purchases[category], form] };
        savePurchase(updatedPurchases);
        saveStock(category, form);
        // setShowPopup({ probiotics: false, fertilizers: false, others: false, postLarvae: false });
        formSetter(resetForm);
        setPurchases(updatedPurchases);
    };

    const [fertilizers, setFertilizers] = useState([
        "NPK", "Fosfato Monopotássico", "Sulfato de Amônio"]);

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
        const checkLists = JSON.parse(localStorage.getItem('stockData')) || {};
        const checkPurchases = JSON.parse(localStorage.getItem('financial')) || {};
        setPurchases(checkPurchases);
        if ('fertilizersList' in checkLists) {
            setFertilizers(checkLists.fertilizersList);
        }
    }, []);

    useEffect(() => {
        if (formFertilizer.fertilizante === 'custom') {
            setAddNewFert(true);
            setShowPopup({ ...showPopup, fertilizers: false });
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
                        <button onClick={() => setShowPopup({ ...showPopup, postLarvae: true })}
                            className="purchases-buttons">Pós-Larvas</button>
                        <button onClick={() => setShowPopup({ ...showPopup, probiotics: true })}
                            className="purchases-buttons">Probióticos</button>
                        <button onClick={() => setShowPopup({ ...showPopup, fertilizers: true })}
                            className="purchases-buttons">Fertilizantes</button>
                        <button onClick={() => setShowPopup({ ...showPopup, others: true })}
                            className="purchases-buttons">Outros</button>
                    </div>
                    <br /><br /><br /><br /><br />
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
                                <input
                                    type="date"
                                    name="dataCompra"
                                    value={formProbiotics.dataCompra}
                                    onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)}
                                    required />
                            </label>
                            <label>
                                Fornecedor:
                                <select
                                    name="fornecedor"
                                    value={formProbiotics.fornecedor}
                                    onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)}
                                    required>
                                    <option value="">Selecione</option>
                                    <option value="Biotrends">Biotrends</option>
                                    <option value="Phibro">Phibro</option>
                                    <option value="DB Aqua">DB Aqua</option>
                                    <option value="Outro">Outro - Informar</option>
                                    {/* ajustar inclusão de novas marcas */}
                                </select>
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={formProbiotics.quantidade}
                                    onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)}
                                    required />
                            </label>
                            <label>
                                Preço:
                                <input
                                    type="number"
                                    name="preco"
                                    value={formProbiotics.preco}
                                    onChange={(e) => handleChange(e, setFormProbiotics, formProbiotics)}
                                    required />
                            </label>
                            <p>Total: R$ {(formProbiotics.preco * formProbiotics.quantidade).toLocaleString('pt-BR',
                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                                <br />
                                <br />
                                <br />
                                <div className="bottom-buttons">
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
                        </div>
                    </div>
                </>
            )}

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

            {showPopup.others && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Adicionar Outros</h3>
                        <form
                            onSubmit={(e) => handleSubmit(e, formOthers, setFormOthers, 'othersPurchase')}
                            className="harv-form">
                            <label>
                                Data da Compra:
                                <input
                                    type="date"
                                    name="dataCompra"
                                    value={formOthers.dataCompra}
                                    onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                                    required />
                            </label>
                            <label>
                                Item:
                                <input
                                    type="text"
                                    name="item"
                                    value={formOthers.item}
                                    onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                                    required />
                            </label>
                            <label>
                                Unidade:
                                <select
                                    name="unidade"
                                    value={formOthers.unidade}
                                    onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                                    required>
                                    <option value="">Selecione</option>
                                    <option value="unidade">Unidade</option>
                                    <option value="kg">Kg</option>
                                    <option value="g">g</option>
                                    <option value="l">L</option>
                                    <option value="ml">mL</option>
                                    <option value="m">m</option>
                                    <option value="cm">cm</option>
                                </select>
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={formOthers.quantidade}
                                    onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                                    required />
                            </label>
                            <label>
                                Preço:
                                <input
                                    type="number"
                                    name="preco"
                                    value={formOthers.preco}
                                    onChange={(e) => handleChange(e, setFormOthers, formOthers)}
                                    required />
                            </label>

                            <p>Total: R$ {(formOthers.preco * formOthers.quantidade).toLocaleString('pt-BR',
                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => setShowPopup({ ...showPopup, others: false })}
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

            {showPopup.postLarvae &&
                <PostLarvaePurchasePopup
                    purchases={purchases}
                    setPurchases={setPurchases} 
                    showPopup={showPopup}
                    capitalizeProperly={capitalizeProperly}
                    setShowPopup={setShowPopup}
                    setShowSavedMessage={setShowSavedMessage}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}/>}

            {showSavedMessage && <div className="saved-message">Salvo!</div>}

        </div>
    );
};

export default Purchases;
