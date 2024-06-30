import React, { useState, useEffect } from "react";

const RationPurchasesPopup = ({ setShowRationPurchasesPopup }) => {
    const [addNewBrandPopup, setAddNewBrandPopup] = useState(false);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [rationsBrands, setRationsBrands] = useState([]);
    const [addNewBrand, setAddNewBrand] = useState('');
    const [formRation, setFormRation] = useState({
        dataCompra: new Date().toISOString().split('T')[0],
        validade: '',
        marca: '',
        tamanhoSaco: '',
        quantidade: '',
        quantidadeSacos: '',
        preco: '',
        tipo: ''
    });

    const [brands, setBrands] = useState(["Aquavita", "Biotê", "Guabi", "Integral", "Poli Nutri", "Presence", "Samaria", "Total"]);
    const [showFieldNewBrand, setShowFieldNewBrand] = useState(false);

    useEffect(() => {
        const storedStockData = JSON.parse(localStorage.getItem('stockData')) || {};
        if ('brandRatioList' in storedStockData) {
            setRationsBrands(storedStockData.brandRatioList);
        }
    }, []);

    useEffect(() => {
        if (formRation.marca === 'custom') {
            setAddNewBrandPopup(true);
        } else {
            setAddNewBrandPopup(false);
        }
    }, [formRation.marca]);

    useEffect(() => {
        if (addNewBrand === 'custom') {
            setShowFieldNewBrand(true);
            setAddNewBrand('');
        }
    }, [addNewBrand]);

    const handleChange = (e) => {
        setFormRation({ ...formRation, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let financial = JSON.parse(localStorage.getItem('financial')) || {};
        let formRationCheckOut = formRation;
        const { quantidadeSacos, tamanhoSaco, marca } = formRation;
        formRationCheckOut = {
            ...formRationCheckOut,
            quantidade: parseInt(quantidadeSacos) * parseInt(tamanhoSaco),
            fornecedor: marca
        };

        if (financial) {
            if ('feedPurchase' in financial) {
                formRationCheckOut = {
                    ...formRationCheckOut,
                    purchaseId: {
                        purchase: 'ration',
                        id: financial.feedPurchase.length + 1
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
        saveInStock(formRationCheckOut);
        setFormRation({
            ...formRation,
            validade: '',
            marca: '',
            tamanhoSaco: '',
            quantidadeSacos: '',
            preco: '',
            tipo: ''
        });
        setShowRationPurchasesPopup(false);
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
        setFormRation({ ...formRation, marca: addNewBrand });
        setRationsBrands(stockData.brandRatioList);
        setAddNewBrand('');
        setShowFieldNewBrand(false);
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    }

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
                                name="dataCompra"
                                value={formRation.dataCompra}
                                onChange={handleChange}
                                required />
                        </label>
                        <label>
                            Marca da Ração:
                            <select
                                name="marca"
                                value={formRation.marca}
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
                                name="tipo"
                                value={formRation.tipo}
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
                                name="tamanhoSaco"
                                value={formRation.tamanhoSaco}
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
                                name="validade"
                                value={formRation.validade}
                                onChange={handleChange}
                                required />
                        </label>
                        <label>
                            Quantidade de Sacos:
                            <input
                                type="number"
                                name="quantidadeSacos"
                                value={formRation.quantidadeSacos}
                                onChange={handleChange}
                                required />
                        </label>

                        <label>
                            Preço por Saco:
                            <input
                                type="number"
                                name="preco"
                                value={formRation.preco}
                                onChange={handleChange}
                                required />
                        </label>
                        <p>Total: R$ {(formRation.preco * formRation.quantidadeSacos).toLocaleString('pt-BR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <br />
                        <br />
                        <br />
                        <div className="bottom-buttons">
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
