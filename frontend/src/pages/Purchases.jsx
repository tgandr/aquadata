import React, { useState, useEffect } from 'react';
import RationPurchasesPopup from './RationPurchasesPopup';
import PostLarvaePurchasePopup from './PostLarvaePurchasePopup';
import FertilizersPurchasePopup from './FertilizersPurchasePopup';
import OthersPurchasePopup from './OthersPurchasePopup';
import ProbioticsPurchasePopup from './ProbioticsPurchasePopup';
import { v4 as uuidv4 } from 'uuid';

const Purchases = ({ setShowPurchasesPopup, base }) => {
    const [showRationPurchasesPopup, setShowRationPurchasesPopup] = useState(false);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    // const [purchases, setPurchases] = useState({});
    const purchases = base.financial
    const [showPopup, setShowPopup] = useState({
        probiotics: false,
        fertilizers: false,
        others: false,
        postLarvae: false
    });

    const saveStock = (category, toUpdate) => {
        let stock = base.stock
        if (category in stock) {
            stock[category].push(toUpdate);
        } else {
            stock = { ...stock, [category]: [toUpdate] }
        }
        // localStorage.setItem('stockData', JSON.stringify(stock));
        base.db.put(stock).then(res => {
            stock._rev = res.rev
            base.setStock(stock)
        })
    };

    const handleChange = (e, formSetter, form) => {
        formSetter({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e, form, formSetter, category) => {
        e.preventDefault();

        if (!purchases[category]) {
            purchases[category] = [];
        }
        const newForm = { ...form, id: uuidv4() };
        const keys = Object.keys(form);
        let resetForm = {};
        keys.forEach((key) => (key !== 'dataCompra' && (resetForm = { ...resetForm, [key]: '' })))
        resetForm = { ...resetForm, dataCompra: form.dataCompra }
        const updatedPurchases = { ...purchases, [category]: [...purchases[category], newForm] };
        base.db.put(updatedPurchases).then(res => {
            updatedPurchases._rev = res.rev
            base.setFinancial(updatedPurchases)
        })
        saveStock(category, newForm);
        formSetter(resetForm);
        // setPurchases(updatedPurchases)
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

    const updateDb = (updatedPurchases, category) => {
        // const financialData = JSON.parse(localStorage.getItem('financial')) || {};
        // const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
        let financial = base.financial;
        let stock = base.stock;
        financial[category] = updatedPurchases;
        stock[category] = updatedPurchases;
        base.db.put(financial).then(res => {
            financial._rev = res.rev
            base.setFinancial(financial)
        })
        base.db.put(stock).then(res => {
            financial._rev = res.rev
            base.setStock(stock)
        })
        // localStorage.setItem('financial', JSON.stringify(financialData));
        // localStorage.setItem('stockData', JSON.stringify(stockData));
    };

    const handleDeletePurchase = (id, category) => {
        const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");
        if (isConfirmed) {
            const updatedPurchases = purchases[category].filter(purchase => purchase.id !== id);

            // setPurchases({ ...purchases, [category]: updatedPurchases });
            updateDb(updatedPurchases, category);
        }
    };

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
                <RationPurchasesPopup setShowRationPurchasesPopup={setShowRationPurchasesPopup} base={base}/>}

            {showPopup.probiotics && // Adicione o novo popup aqui
                <ProbioticsPurchasePopup
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    capitalizeProperly={(str) => str.charAt(0).toUpperCase() + str.slice(1)}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setShowSavedMessage={setShowSavedMessage}
                    // purchases={purchases}
                    // setPurchases={setPurchases}
                    handleDeletePurchase={handleDeletePurchase}
                    base={base}
                />
            }

            {showPopup.fertilizers && (
                <FertilizersPurchasePopup
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    capitalizeProperly={capitalizeProperly}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    // purchases={purchases}
                    // setPurchases={setPurchases}
                    setShowSavedMessage={setShowSavedMessage}
                    handleDeletePurchase={handleDeletePurchase}
                    base={base}
                />
            )}

            {showPopup.others &&
                <OthersPurchasePopup
                    setShowPopup={setShowPopup}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    // purchases={purchases}
                    // setPurchases={setPurchases}
                    base={base}
                    handleDeletePurchase={handleDeletePurchase} />}

            {showPopup.postLarvae &&
                <PostLarvaePurchasePopup
                    // purchases={purchases}
                    // setPurchases={setPurchases}
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    capitalizeProperly={capitalizeProperly}
                    setShowSavedMessage={setShowSavedMessage}
                    handleChange={handleChange}
                    base={base}
                    handleSubmit={handleSubmit} />}

            {showSavedMessage && <div className="saved-message">Salvo!</div>}

        </div>
    );
};

export default Purchases;
