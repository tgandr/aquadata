import React, { useState, useEffect } from "react";

const RationPurchasesPopup = ({ setShowRationPurchasesPopup }) => {
    const [addNewBrandPopup, setAddNewBrandPopup] = useState(false);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [rationsBrands, setRationsBrands] = useState([]);
    const [addNewBrand, setAddNewBrand] = useState('');
    const [formRation, setFormRation] = useState({
        purchaseDate: '',
        validityDate: '',
        brand: '',
        bagSize: '',
        bagsQuantity: '',
        prizePerBag: '',
        feedType: ''
    });
    const [addBrand, setAddBrand] = useState('');
    const [brands, setBrands] = useState(["Aquavita", "Biotê", "Guabi", "Integral", "Poli Nutri", "Presence", "Samaria", "Total"]);
    const [showFieldNewBrand, setShowFieldNewBrand] = useState(false);

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
        if (addBrand === 'custom') {
            setShowFieldNewBrand(true);
        } else {
            setShowFieldNewBrand(false);
        }
    }, [addBrand]);

    const handleChange = (e) => {
        setFormRation({ ...formRation, [e.target.name]: e.target.value });
        console.log(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let financial = JSON.parse(localStorage.getItem('financial')) || {};
        let formRationCheckOut = formRation;
        if (financial) {
            if ('feedPurchase' in financial) {
                formRationCheckOut = {
                    ...formRationCheckOut,
                    purchaseId: {
                        purchase: 'ration',
                        id: financial.feedPurchase.length
                    }
                }
                financial.feedPurchase.push(formRationCheckOut);
            } else {
                formRationCheckOut = {
                    ...formRationCheckOut,
                    purchaseId: {
                        purchase: 'ration',
                        id: 1
                    }
                }
                financial = { ...financial, feedPurchase: [formRationCheckOut] }
            }
        } else {
            formRationCheckOut = {
                ...formRationCheckOut,
                purchaseId: {
                    purchase: 'ration',
                    id: 1
                }
            }
            financial = { feedPurchase: [formRationCheckOut] }
        }
        localStorage.setItem('financial', JSON.stringify(financial));
        setFormRation({
            purchaseDate: '',
            validityDate: '',
            brand: '',
            bagSize: '',
            bagsQuantity: '',
            prizePerBag: '',
            feedType: ''
        });
        setShowRationPurchasesPopup(false);
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
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    }

    return (
        <div>
            <div className="popup">
                <div className="popup-inner">
                    <h3>Adicionar Ração</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Data da Compra:
                            <input
                                type="date"
                                name="purchaseDate"
                                value={formRation.purchaseDate}
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
                                <option value="">Indique o fabricante de ração</option>
                                {rationsBrands.map((brand, i) => (
                                    <option key={i} value={brand}>{brand}</option>
                                ))}
                                <option value="custom">Adicionar fabricante</option>
                            </select>
                        </label>
                        <label>
                            Tipo de Ração:
                            <select
                                name="feedType"
                                value={formRation.feedType}
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
                            Quantidade de Sacos:
                            <input
                                type="number"
                                name="bagsQuantity"
                                value={formRation.bagsQuantity}
                                onChange={handleChange}
                                required />
                        </label>
                        <label>
                            Tamanho do Saco:
                            <select
                                name="bagSize"
                                value={formRation.bagSize}
                                onChange={handleChange}
                                required>
                                <option value="">Selecione</option>
                                <option value="10 kg">10 kg</option>
                                <option value="15 kg">15 kg</option>
                                <option value="20 kg">20 kg</option>
                                <option value="25 kg">25 kg</option>
                                <option value="30 kg">30 kg</option>
                            </select>
                        </label>
                        <label>
                            Data de Validade:
                            <input
                                type="date"
                                name="validityDate"
                                value={formRation.validityDate}
                                onChange={handleChange}
                                required />
                        </label>
                        <label>
                            Preço por Saco:
                            <input
                                type="number"
                                name="prizePerBag"
                                value={formRation.prizePerBag}
                                onChange={handleChange}
                                required />
                        </label>
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setShowRationPurchasesPopup(false)}>Cancelar</button>
                    </form>
                </div>
            </div>

            {addNewBrandPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <label>Cadastrar novo fabricante:</label>
                        <select
                            name="addBrand"
                            value={addBrand}
                            onChange={(e) => setAddBrand(e.target.value)}>
                            <option value="">Selecione um fabricante</option>
                            {brands.map((brand, i) => (
                                <option key={i} value={brand}>{brand}</option>
                            ))}
                            <option value="custom">Adicionar fabricante</option>
                        </select>
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
                        <button onClick={saveNewBrand}>Confirmar</button>
                        <button onClick={() => setAddNewBrandPopup(false)}>Voltar</button>
                    </div>
                </div>
            )}

            {showSavedMessage && <div className="saved-message">Salvo!</div>}
        </div>
    );
}

export default RationPurchasesPopup;
