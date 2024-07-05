import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatDate } from './utils';

const PostLarvaePurchasePopup = ({purchases, setPurchases, showPopup, setShowPopup,
    setShowSavedMessage, capitalizeProperly, handleChange, handleSubmit}) => {
    const [formPostLarvae, setFormPostLarvae] = useState({
        dataCompra: new Date().toISOString().split('T')[0],
        fornecedor: '',
        quantidade: '',
        preco: ''
    });

    const [addNewPostLarvae, setAddNewPostLarvae] = useState('');
    const [customPostLarvae, setCustomPostLarvae] = useState('');
    const [showPostLarvaePurchaseTable, setShowPostLarvaePurchaseTable] = useState(false);

    const [postLarvae, setPostLarvae] = useState([
        "Aquacrusta", "Aquatec", "CELM", "Larvifort"])

    const savePostLarvaeList = (l) => {
        const larvae = capitalizeProperly(l);
        if (l !== '') {
            setPostLarvae([...postLarvae, larvae]);
            setCustomPostLarvae('');
            let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            if ('postLarvaeList' in stockData) {
                stockData.postLarvaeList.push(larvae);
            } else {
                stockData.postLarvaeList = [...postLarvae, larvae];
            }
            localStorage.setItem('stockData', JSON.stringify(stockData));
        }
        setFormPostLarvae({ ...formPostLarvae, fornecedor: larvae });
        setAddNewPostLarvae(false);
        setShowPopup({ ...showPopup, postLarvae: true });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    };

    useEffect(() => {
        const checkLists = JSON.parse(localStorage.getItem('stockData')) || {};
        const checkPurchases = JSON.parse(localStorage.getItem('financial')) || {};
        // setPurchases(checkPurchases);

        if ('postLarvaeList' in checkLists) {
            setPostLarvae(checkLists.postLarvaeList);
        }
    }, []);

    useEffect(() => {
        if (formPostLarvae.fornecedor === 'custom') {
            console.log(formPostLarvae)
            setAddNewPostLarvae(true);
            // setShowPopup({ ...showPopup, postLarvae: false });
        } else {
            setAddNewPostLarvae(false);
        }
    }, [formPostLarvae.fornecedor]);

    useEffect(() => {
        if ('postLarvaePurchase' in purchases) {
            if (purchases.postLarvaePurchase.length > 0) {
                setShowPostLarvaePurchaseTable(true)
            } else {
                setShowPostLarvaePurchaseTable(false)
            }
        }
    }, [purchases]);

    const handleDeletePurchase = (index) => {
        const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");
        if (isConfirmed) {
            const actualIndex = purchases.postLarvaePurchase.length - 1 - index;
            const updatedPurchases = { ...purchases };
            updatedPurchases.postLarvaePurchase.splice(actualIndex, 1);
            localStorage.setItem('financial', JSON.stringify(updatedPurchases));
            setPurchases(updatedPurchases);
        }
    };

    return (
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h3>Adicionar Pós-Larvas</h3>
                    <form
                        onSubmit={(e) => handleSubmit(e, formPostLarvae, setFormPostLarvae, 'postLarvaePurchase')}
                        className="harv-form">
                        <label>
                            Data da Compra:
                            <input
                                type="date"
                                name="dataCompra"
                                value={formPostLarvae.dataCompra}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required />
                        </label>
                        <label>
                            Fornecedor:
                            <select
                                name="fornecedor"
                                value={formPostLarvae.fornecedor}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required>
                                <option value="">Selecione</option>
                                {postLarvae.map((pl, index) => (
                                    <option value={pl} key={index}>{pl}</option>
                                ))}
                                <option value="custom">Outro - Informar</option>
                            </select>
                        </label>
                        <label>
                            Milheiros:
                            <input
                                type="number"
                                name="quantidade"
                                value={formPostLarvae.quantidade}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required />
                        </label>
                        <label>
                            Preço por milheiro:
                            <input
                                type="number"
                                name="preco"
                                value={formPostLarvae.preco}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required />
                        </label>
                        <p>Total: R$ {(formPostLarvae.preco * formPostLarvae.quantidade).toLocaleString('pt-BR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <div className="buttons-box">
                            <button
                                type="button"
                                onClick={() => setShowPopup({ ...showPopup, postLarvae: false })}
                                className="cancel-button">
                                Voltar
                            </button>
                            <button type="submit" className="first-class-button">
                                Salvar
                            </button>
                        </div>
                    </form>

                    {showPostLarvaePurchaseTable &&
                        <>
                            <h4>Últimas Compras de Pós-Larvas</h4>
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        {/* <th>Fornecedor</th> */}
                                        {/* <th>Quantidade (Milheiros)</th> */}
                                        {/* <th>Preço por Milheiro</th> */}
                                        <th>Compra</th>
                                        <th>Excluir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchases.postLarvaePurchase
                                        .slice(-5)
                                        .reverse()
                                        .map((purchase, index) => (
                                            <tr key={index}>
                                                <td>{formatDate(purchase.dataCompra).date}</td>
                                                {/* <td>{purchase.fornecedor}</td> */}
                                                {/* <td>{purchase.quantidade}</td> */}
                                                {/* <td>R$ {purchase.preco}</td> */}
                                                <td>R$ {(purchase.preco * purchase.quantidade).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - <br />
                                                    {purchase.quantidade} mil larvas</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePurchase(index)}
                                                        className="delete-button">
                                                        <i className="fas fa-trash" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </>
                    }
                </div>
            </div>


            {addNewPostLarvae && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Informar novo fornecedor de pós-larvas</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                savePostLarvaeList(customPostLarvae);
                            }}
                            className="harv-form">
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    name="fertilizer"
                                    value={customPostLarvae}
                                    onChange={(e) => setCustomPostLarvae(e.target.value)}
                                    required />
                            </label>
                            {/* <label>
                        Município do laboratório:
                        <input
                            type="text"
                            name="fertilizer"
                            value={customPostLarvae.city}
                            onChange={(e) => setCustomPostLarvae({...customPostLarvae, city: e.target.value})} required />
                    </label> */}
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => (setAddNewPostLarvae(false), setShowPopup({ ...showPopup, postLarvae: true }))}
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
        </>
    )

}

export default PostLarvaePurchasePopup;