import React, { useState, useEffect } from "react";
import { formatDate } from './utils';

const RationPurchasesPopup = ({ setShowRationPurchasesPopup }) => {
    const [addNewBrandPopup, setAddNewBrandPopup] = useState(false);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [rationsBrands, setRationsBrands] = useState([]);
    const [addNewBrand, setAddNewBrand] = useState('');
    const [rationPurchases, setRationPurchases] = useState([]);
    const [showRationPurchaseTable, setShowRationPurchaseTable] = useState(false);
    const [formRation, setFormRation] = useState({
        date: new Date().toISOString().split('T')[0],
        validity: '',
        brand: '',
        bagSize: '',
        quantity: '',
        bagQuantity: '',
        value: '',
        type: ''
    });

    const [brands, setBrands] = useState(["Aquavita", "Biotê", "Guabi", "Integral", "Poli Nutri", "Presence", "Samaria", "Total"]);
    const [showFieldNewBrand, setShowFieldNewBrand] = useState(false);

    const handleChange = (e) => {
        setFormRation({ ...formRation, [e.target.name]: e.target.value });
    };

    const generateUniqueId = () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let financial = JSON.parse(localStorage.getItem('financial')) || {};
        let formRationCheckOut = formRation;
        const { bagQuantity, bagSize, brand } = formRation;
        formRationCheckOut = {
            ...formRationCheckOut,
            quantity: parseInt(bagQuantity) * parseInt(bagSize),
            label: brand
        };

        if (financial) {
            if ('feedPurchase' in financial) {
                formRationCheckOut = {
                    ...formRationCheckOut,
                    purchaseId: {
                        purchase: 'ration',
                        id: generateUniqueId()
                    }
                }
                financial.feedPurchase.push(formRationCheckOut);
            } else {
                formRationCheckOut = {
                    ...formRationCheckOut,
                    purchaseId: {
                        purchase: 'ration',
                        id: generateUniqueId()
                    }
                }
                financial = { ...financial, feedPurchase: [formRationCheckOut] }
            }
        } else {
            formRationCheckOut = {
                ...formRationCheckOut,
                purchaseId: {
                    purchase: 'ration',
                    id: generateUniqueId()
                }
            }
            financial = { feedPurchase: [formRationCheckOut] }
        }
        localStorage.setItem('financial', JSON.stringify(financial));
        saveInStock(formRationCheckOut);
        setFormRation({
            ...formRation,
            validity: '',
            brand: '',
            bagSize: '',
            bagQuantity: '',
            value: '',
            type: ''
        });
        // setShowRationPurchasesPopup(false);
    }

    const saveInStock = (toSave) => {
        let stock = JSON.parse(localStorage.getItem('stockData')) || {};
        if ('feedPurchase' in stock) {
            stock.feedPurchase.push(toSave);
        } else {
            stock = { ...stock, feedPurchase: [toSave] }
        }
        localStorage.setItem('stockData', JSON.stringify(stock));
    }

    const saveNewBrand = () => {
        let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
        if (stockData) {
            if ('brandRatioList' in stockData) {
                stockData.brandRatioList.push(addNewBrand);
            } else {
                stockData = { ...stockData, brandRatioList: [addNewBrand] };
            }
        } else {
            stockData = { brandRatioList: [addNewBrand] };
        }
        localStorage.setItem('stockData', JSON.stringify(stockData));
        setFormRation({ ...formRation, brand: addNewBrand });
        setRationsBrands(stockData.brandRatioList);
        setAddNewBrand('');
        setShowFieldNewBrand(false);
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    }

    const handleDeletePurchase = (index) => {
        const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");

        if (isConfirmed) {
            let stock = JSON.parse(localStorage.getItem('stockData'));
            let feedStock = stock.feedPurchase;
            const id = rationPurchases[index].purchaseId.id;
            feedStock = feedStock.filter(item => item.purchaseId.id !== id); 
            stock = {...stock, feedPurchase: feedStock}
            localStorage.setItem('stockData', JSON.stringify(stock));
    
            const updatedPurchases = [...rationPurchases];
            updatedPurchases.splice(index, 1);
            localStorage.setItem('financial', JSON.stringify({ ...JSON.parse(localStorage.getItem('financial')), feedPurchase: updatedPurchases }));
            setRationPurchases(updatedPurchases);
        }
    };

    useEffect(() => {
        const storedStockData = JSON.parse(localStorage.getItem('stockData')) || {};
        if ('brandRatioList' in storedStockData) {
            setRationsBrands(storedStockData.brandRatioList);
        }
    }, []);

    useEffect(() => {
        if (formRation.brand === 'custom') {
            setAddNewBrandPopup(true);
        } else {
            setAddNewBrandPopup(false);
        }
    }, [formRation.brand]);

    useEffect(() => {
        if (addNewBrand === 'custom') {
            setShowFieldNewBrand(true);
            setAddNewBrand('');
        }
    }, [addNewBrand]);

    useEffect(() => {
        const storedFinancialData = JSON.parse(localStorage.getItem('financial')) || {};
        if ('feedPurchase' in storedFinancialData) {
            setRationPurchases(storedFinancialData.feedPurchase.slice(-5).reverse());
            if (storedFinancialData.feedPurchase.length > 0) {
                setShowRationPurchaseTable(true);
            } else {
                setShowRationPurchaseTable(false);
            }
        }
    }, [formRation]);

    return (
        <div>
            <div className="popup">
                <div className="popup-inner">
                    <h3>Adicionar Ração</h3>
                    <form onSubmit={handleSubmit} className="harv-form">
                        <label>
                            Data da Compra:
                            <input
                                type="date"
                                name="date"
                                value={formRation.date}
                                onChange={handleChange}
                                required />
                        </label>
                        <label>
                            Marca da Ração:
                            <select
                                name="brand"
                                value={formRation.brand}
                                onChange={handleChange}
                                required>
                                <option value="">Fabricante de ração</option>
                                {rationsBrands.map((marca, i) => (
                                    <option key={i} value={marca}>{marca}</option>
                                ))}
                                <option value="custom">Adicionar fabricante</option>
                            </select>
                        </label>
                        <label>
                            Tipo de Ração:
                            <select
                                name="type"
                                value={formRation.type}
                                onChange={handleChange}
                                required>
                                <option value="">Selecione</option>
                                <option value="Inicial">Inicial</option>
                                <option value="1.0 mm">1.0 mm</option>
                                <option value="2.0 mm">2.0 mm</option>
                                <option value="3.0 mm">3.0 mm</option>
                            </select>
                        </label>
                        <label>
                            Tamanho do Saco:
                            <select
                                name="bagSize"
                                value={formRation.bagSize}
                                onChange={handleChange}
                                required>
                                <option value="">Selecione</option>
                                <option value="20">20 kg</option>
                                <option value="25">25 kg</option>
                                <option value="30">30 kg</option>
                                <option value="40">40 kg</option>
                            </select>
                        </label>
                        <label>
                            Data de Validade:
                            <input
                                type="date"
                                name="validity"
                                value={formRation.validity}
                                onChange={handleChange}
                                required />
                        </label>
                        <label>
                            Quantidade de Sacos:
                            <input
                                type="number"
                                name="bagQuantity"
                                value={formRation.bagQuantity}
                                onChange={handleChange}
                                required />
                        </label>

                        <label>
                            Preço por Saco:
                            <input
                                type="number"
                                name="value"
                                value={formRation.value}
                                onChange={handleChange}
                                required />
                        </label>
                        <p>Total: R$ {(formRation.value * formRation.bagQuantity).toLocaleString('pt-BR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <div className="buttons-box">
                            <button
                                type="button"
                                onClick={() => setShowRationPurchasesPopup(false)}
                                className="cancel-button">
                                Voltar</button>
                            <button
                                type="submit"
                                className="first-class-button">
                                Salvar</button>
                        </div>
                    </form>
                    <br />

                    {showRationPurchaseTable && (
                        <div>
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Compra</th>
                                        <th>Excluir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rationPurchases.map((purchase, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(purchase.date).date}</td>
                                            <td>{purchase.brand} - {purchase.type} <br />
                                                R$ {(purchase.value * purchase.bagQuantity).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <button className="delete-button" onClick={() => handleDeletePurchase(index)}>
                                                <i className="fas fa-trash" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>

            {addNewBrandPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <form className="harv-form">
                            <label>Cadastrar novo fabricante:
                                <select
                                    name="addBrand"
                                    value={addNewBrand}
                                    onChange={(e) => setAddNewBrand(e.target.value)}>
                                    <option value="">Selecione um fabricante</option>
                                    {brands.map((marca, i) => (
                                        <option key={i} value={marca}>{marca}</option>
                                    ))}
                                    <option value="custom">Adicionar fabricante</option>
                                </select>
                            </label>
                        </form>

                        {showFieldNewBrand && (
                            <div>
                                <label>Adicione novo fabricante</label>
                                <input
                                    type="text"
                                    value={addNewBrand}
                                    onChange={(e) => setAddNewBrand(e.target.value)}
                                />
                            </div>
                        )}
                        <br />
                        <br />
                        <div className="bottom-buttons">
                            <button
                                onClick={() => setAddNewBrandPopup(false)}
                                className="cancel-button">Voltar</button>
                            <button
                                onClick={saveNewBrand}
                                className="first-class-button">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showSavedMessage && <div className="saved-message">Salvo!</div>}
        </div>
    );
}

export default RationPurchasesPopup;
