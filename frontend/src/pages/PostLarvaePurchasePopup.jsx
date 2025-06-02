import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatDate } from './utils';

const PostLarvaePurchasePopup = ({ showPopup, setShowPopup,
    setShowSavedMessage, capitalizeProperly, handleChange, handleSubmit, base }) => {
    const [formPostLarvae, setFormPostLarvae] = useState({
        date: new Date().toISOString().split('T')[0],
        label: '',
        quantity: '',
        value: '',
        pond: '',
        dateIn: ''
    });
    const [history, setHistory] = useState([])
    const [addNewPostLarvae, setAddNewPostLarvae] = useState('');
    const [customPostLarvae, setCustomPostLarvae] = useState('');
    const [showPostLarvaePurchaseTable, setShowPostLarvaePurchaseTable] = useState(false);
    const [datesIn, setDatesIn] = useState('');
    const purchases = base.financial
    const [postLarvae, setPostLarvae] = useState([
        "Aquacrusta", "Aquatec", "CELM", "Larvifort"]);
    const viveiros = base.viveiros
    const savePostLarvaeList = (l) => {
        const larvae = capitalizeProperly(l);
        let stockData = {...base.stock}
        if (l !== '') {
            setPostLarvae([...postLarvae, larvae]);
            setCustomPostLarvae('');
            if ('postLarvaeList' in stockData) {
                stockData.postLarvaeList.push(larvae);
            } else {
                stockData.postLarvaeList = [...postLarvae, larvae];
            }
            // localStorage.setItem('stockData', JSON.stringify(stockData));
            base.db.put(stockData).then(res => {
                stockData._rev = res.rev
                base.setStock(stockData)
            })
        }
        setFormPostLarvae({ ...formPostLarvae, fornecedor: larvae });
        setAddNewPostLarvae(false);
        setShowPopup({ ...showPopup, postLarvae: true });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    };

    useEffect(() => {
        // const checkLists = JSON.parse(localStorage.getItem('stockData')) || {};
        // const checkPurchases = JSON.parse(localStorage.getItem('financial')) || {};
        const checkLists = base.stock
        // const checkPurchases = base.financial
        // setPurchases(checkPurchases);
        if ('postLarvaeList' in checkLists) {
            setPostLarvae(checkLists.postLarvaeList);
        }

        base.db.find({
            selector: {dataType: 'cultivation'}
        }).then(data => setHistory(data.docs))
    }, []);

    useEffect(() => {
        if (formPostLarvae.label === 'custom') {
            setAddNewPostLarvae(true);
        } else {
            setAddNewPostLarvae(false);
        }
    }, [formPostLarvae.label]);

    useEffect(() => {
        if ('postLarvaePurchase' in purchases) {
            if (purchases.postLarvaePurchase.length > 0) {
                setShowPostLarvaePurchaseTable(true)
            } else {
                setShowPostLarvaePurchaseTable(false)
            }
        }
    }, [base.financial]);

    useEffect(() => {
        if (formPostLarvae.pond !== "") {
            // const history = JSON.parse(localStorage.getItem('history'));
            if (!history.length) return
            console.log(history)
            const pondHistory = history.filter(pond => (pond.viveiroId === formPostLarvae.pond));
            console.log(history)
            console.log(formPostLarvae)
            setFormPostLarvae({ ...formPostLarvae, quantity: (parseInt(pondHistory[0].quantidadeEstocada) / 1000) })
            setDatesIn(pondHistory);
        }
    }, [formPostLarvae.pond]);

    useEffect(() => {
        if (formPostLarvae.dateIn !== "") {
            // const cultivo = JSON.parse(localStorage.getItem(`cultivo-${formPostLarvae.dateIn}`));
            setFormPostLarvae({ ...formPostLarvae, label: ''})
        }
    }, [formPostLarvae.dateIn])

    const handleDeletePurchase = (index) => {
        const isConfirmed = window.confirm("Tem certeza de que deseja excluir este registro?");
        if (isConfirmed) {
            const purchases = {...base.financial}
            const actualIndex = purchases.postLarvaePurchase.length - 1 - index;
            const updatedPurchases = { ...purchases };
            const deletedPurchase = updatedPurchases.postLarvaePurchase[actualIndex];

            updatedPurchases.postLarvaePurchase.splice(actualIndex, 1);
            // localStorage.setItem('financial', JSON.stringify(updatedPurchases));
            base.db.put(updatedPurchases).then(res => {
                updatedPurchases._rev = res.rev
                base.setFinancial(updatedPurchases)
            })
            // setPurchases(updatedPurchases);

            // let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            let stockData = {...base.stock}
            if ('postLarvaePurchase' in stockData) {
                stockData.postLarvaePurchase = stockData.postLarvaePurchase.filter(purchase => purchase.id !== deletedPurchase.id);
            }
            base.db.put(stockData).then(res => {
                stockData._rev = res.rev
                base.setStock(stockData)
            })
            // localStorage.setItem('stockData', JSON.stringify(stockData));
        }
    };

    return (
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h3>Adicionar Pós-Larvas</h3>
                    <p>Observação: anote aqui uma compra por viveiro. Caso dois povoamentos sejam pagos juntos,
                        anote um primeiro, depois anote o outro.
                    </p>
                    <form
                        onSubmit={(e) => handleSubmit(e, formPostLarvae, setFormPostLarvae, 'postLarvaePurchase')}
                        className="harv-form">
                        <label>
                            Data da Compra:
                            <input
                                type="date"
                                name="date"
                                value={formPostLarvae.date}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required />
                        </label>
                        <label>
                            Viveiro povoado:
                            <select
                                name="pond"
                                value={formPostLarvae.pond}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required>
                                <option value="">Selecione</option>
                                {viveiros && viveiros.map((viv, index) => (
                                    <option value={viv._id} key={index}>{viv.nome}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Data do povoamento:
                            <select
                                name="dateIn"
                                value={formPostLarvae.dateIn}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required>
                                <option value="">Selecione</option>
                                {datesIn && datesIn.map((viv, index) => (
                                    <option value={viv.id} key={index}>{formatDate(viv.dataPovoamento).date}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Fornecedor:
                            <select
                                name="label"
                                value={formPostLarvae.label}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required>
                                <option value="">Selecione</option>
                                {postLarvae.map((pl, index) => (
                                    pl === formPostLarvae.label
                                        ? (<option value={pl} key={index} selected>{pl}</option>)
                                        : (<option value={pl} key={index}>{pl}</option>)
                                ))}

                                <option value="custom">Outro - Informar</option>
                            </select>
                        </label>
                        <label>
                            Preço por milheiro:
                            <input
                                type="number"
                                name="value"
                                value={formPostLarvae.value}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required />
                        </label>
                        <label>
                            Milheiros:
                            <input
                                type="number"
                                name="quantity"
                                value={formPostLarvae.quantity}
                                onChange={(e) => handleChange(e, setFormPostLarvae, formPostLarvae)}
                                required />
                        </label>

                        <p>Total: R$ {(formPostLarvae.value * formPostLarvae.quantity).toLocaleString('pt-BR',
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
                    <br />

                    {showPostLarvaePurchaseTable &&
                        <>
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
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
                                                <td>{formatDate(purchase.date).date}</td>
                                                <td>R$ {(purchase.value * purchase.quantity).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - <br />
                                                    {purchase.quantity} mil larvas</td>
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