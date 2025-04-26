import React, { useState, useEffect } from "react";
import { formatDate } from './utils';

const RationPurchasesPopup = ({ setShowRationPurchasesPopup, base }) => {
    const [addNewBrandPopup, setAddNewBrandPopup] = useState(false);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [rationsBrands, setRationsBrands] = useState(base.stock.brandRatioList);
    // const [financial, setFinancial] = useState({})
    // const [stockData, setStock] = useState({})
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
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    };

    // useEffect(() => {
    //     database.find({
    //         selector: {dataType: 'financial'}
    //     }).then(data => {
    //         setFinancial(data.docs[0] || {})
    //     })

    //     database.find({
    //         selector: {dataType: 'stockData'}
    //     }).then(data => {
    //         if (!data.docs.length) return 
    //         const stock = data.docs[0]
    //         if ('brandRatioList' in stock) {
    //             setRationsBrands(stock.brandRatioList);
    //         }
    //         setStock(stock)
    //     })
    // }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        let newFinancial = {...base.financial}
        let formRationCheckOut = formRation;
        const { bagQuantity, bagSize, brand } = formRation;
        formRationCheckOut = {
            ...formRationCheckOut,
            quantity: parseInt(bagQuantity) * parseInt(bagSize),
            label: brand
        };

        if (newFinancial) {
            if ('feedPurchase' in newFinancial) {
                formRationCheckOut = {
                    ...formRationCheckOut,
                    purchaseId: {
                        purchase: 'ration',
                        id: generateUniqueId()
                    }
                }
                newFinancial.feedPurchase.push(formRationCheckOut);
            } else {
                formRationCheckOut = {
                    ...formRationCheckOut,
                    purchaseId: {
                        purchase: 'ration',
                        id: generateUniqueId()
                    }
                }
                newFinancial = { ...newFinancial, feedPurchase: [formRationCheckOut] }
            }
        } else {
            formRationCheckOut = {
                ...formRationCheckOut,
                purchaseId: {
                    purchase: 'ration',
                    id: generateUniqueId()
                }
            }
            newFinancial = { feedPurchase: [formRationCheckOut] }
        }
        // localStorage.setItem('financial', JSON.stringify(financial));
        base.db.put(newFinancial).then(res => {
            newFinancial._rev = res.rev
            base.setFinancial(newFinancial)
        })
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
        let stock = {...base.stock}
        if ('feedPurchase' in stock) {
            stock.feedPurchase.push(toSave);
        } else {
            stock = { ...stock, feedPurchase: [toSave] }
        }
        base.db.put(stock).then(res => {
            stock._rev = res.rev
            base.setStock(stock)
        })
        // localStorage.setItem('stockData', JSON.stringify(stock));
    }

    const saveNewBrand = () => {
        let stock = {...base.stock};
        if (stock) {
            if ('brandRatioList' in stock) {
                stock.brandRatioList.push(addNewBrand);
            } else {
                stock = { ...stock, brandRatioList: [addNewBrand] };
            }
        } else {
            stock = { brandRatioList: [addNewBrand] };
        }

        // localStorage.setItem('stock', JSON.stringify(stock));
        base.db.put(stock).then(res => {
            stock._rev = res.rev
            setStock(stock)
        })
        setFormRation({ ...formRation, brand: addNewBrand });
        setRationsBrands(stock.brandRatioList);
        setAddNewBrand('');
        setShowFieldNewBrand(false);
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    }

    // const handleDeletePurchase = (index) => {
    //     const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");

    //     if (isConfirmed) {
    //         let stock = {...stockData}
    //         let feedStock = stock.feedPurchase;
    //         const id = rationPurchases[index].purchaseId.id;
    //         feedStock = feedStock.filter(item => item.purchaseId.id !== id); 
    //         stock = {...stock, feedPurchase: feedStock}
    //         // localStorage.setItem('stockData', JSON.stringify(stock));
            
    //         const updatedPurchases = [...rationPurchases];
    //         updatedPurchases.splice(index, 1);
    //         // localStorage.setItem('financial', JSON.stringify({ ...JSON.parse(localStorage.getItem('financial')), feedPurchase: updatedPurchases }));
    //         setRationPurchases(updatedPurchases);
    //     }
    // };

    const handleDeletePurchase = (index) => {
        const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");
        if (isConfirmed) {
            const purchases = {...base.financial}
            const actualIndex = purchases.feedPurchase.length - 1 - index;
            const updatedPurchases = { ...purchases };
            const deletedPurchase = updatedPurchases.feedPurchase[actualIndex];

            updatedPurchases.feedPurchase.splice(actualIndex, 1);
            // localStorage.setItem('financial', JSON.stringify(updatedPurchases));
            base.db.put(updatedPurchases).then(res => {
                updatedPurchases._rev = res.rev
                base.setFinancial(updatedPurchases)
            })
            // setPurchases(updatedPurchases);

            // let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            let stockData = {...base.stock}
            if ('feedPurchase' in stockData) {
                stockData.feedPurchase = stockData.feedPurchase.filter(purchase => purchase.id !== deletedPurchase.id);
            }
            base.db.put(stockData).then(res => {
                stockData._rev = res.rev
                base.setStock(stockData)
            })
            // localStorage.setItem('stockData', JSON.stringify(stockData));
        }
    };

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
        if (!base.financial) return 
        if ('feedPurchase' in base.financial) {
            setRationPurchases(base.financial.feedPurchase.slice(-5).reverse());
            if (base.financial.feedPurchase.length > 0) {
                setShowRationPurchaseTable(true);
            } else {
                setShowRationPurchaseTable(false);
            }
        }
    }, [base.financial, formRation]);

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
