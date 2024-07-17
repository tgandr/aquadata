import React, { useState, useEffect } from 'react';
import '../styles/Inventory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconContainer } from './utils';

const Inventory = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showFullTable, setShowFullTable] = useState(false);
    const [showTablePopup, setShowTablePopup] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [form, setForm] = useState({
        item: '',
        valor: '',
        valorFinal: '',
        novo: 'novo',
        vidaUtil: '',
        emOperacaoDesde: ''
    });

    const formData = JSON.parse(localStorage.getItem('formData'));

    useEffect(() => {
        const storedInventoryData = JSON.parse(localStorage.getItem('inventoryData'));
        if (storedInventoryData) {
            setInventoryData(storedInventoryData);
        }
    }, []);

    const calculateDepreciation = () => {
        return inventoryData.reduce((total, item) => {
            const meses = parseInt(item.vidaUtil, 10) * 12;
            const valorInicial = parseFloat(item.valor);
            const valorFinal = parseFloat(item.valorFinal);
            const valorMensal = (valorInicial - valorFinal) / meses;
            return total + valorMensal;
        }, 0);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedInventoryData = [...inventoryData];
        if (editIndex !== null) {
            const i = updatedInventoryData.findIndex(item => item.id === editIndex);
            if (i !== -1) {
                updatedInventoryData[i] = { ...form, id: editIndex };
            }
            setEditIndex(null);
        } else {
            const novoItem = { ...form, id: Math.random().toString(36).substr(2, 9) };
            updatedInventoryData.push(novoItem);
        }
        setInventoryData(updatedInventoryData);
        localStorage.setItem('inventoryData', JSON.stringify(updatedInventoryData));
        setShowPopup(false);
        setForm({
            item: '',
            valor: '',
            valorFinal: '',
            novo: 'novo',
            vidaUtil: '',
            emOperacaoDesde: ''
        });
    };

    const handleEditItem = (id) => {
        const item = inventoryData.filter(i => i.id === id);
        setEditIndex(id);
        setForm(item[0]);
        setShowPopup(true);
        setShowTablePopup(false);
    };

    const handleDeleteItem = (id) => {
        if (window.confirm('Tem certeza de que deseja excluir este item?')) {
            const updatedInventoryData = inventoryData.filter(item => item.id !== id);
            setInventoryData(updatedInventoryData);
            localStorage.setItem('inventoryData', JSON.stringify(updatedInventoryData));
        }
    };

    const renderTable = (data) => {
        if (!data.length) {
            return <p>Nenhum patrimônio lançado</p>;
        }
        return (
            <div className="inventory-table">
                <h3>Últimos lançamentos</h3>
                <table className="biometry-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Depreciação</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.item}</td>
                                <td>R$ {(((parseFloat(item.valor) - parseFloat(item.valorFinal)) / (parseInt(item.vidaUtil, 10) * 12)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                                <td style={{ textAlign: "center" }}>
                                    <button className="delete-button" onClick={() => handleEditItem(item.id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const summarizedData = inventoryData.slice(-5).reverse();

    const renderFullTable = (data) => {
        if (!data.length) {
            return <p>Nenhum patrimônio lançado</p>;
        }
        return (
            <div className="inventory-table">
                <table className="biometry-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Item</th>
                            <th>Valor Inicial</th>
                            <th>Valor Final</th>
                            <th>Depreciação</th>
                            <th>Novo/Usado</th>
                            <th>Vida Útil (anos)</th>
                            <th>Em Operação Desde</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.item}</td>
                                <td>R$ {parseFloat(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>R$ {parseFloat(item.valorFinal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>R$ {(((parseFloat(item.valor) - parseFloat(item.valorFinal)) / (parseInt(item.vidaUtil, 10) * 12)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                                <td>{item.novo === 'novo' ? 'Novo' : 'Usado'}</td>
                                <td>{item.vidaUtil}</td>
                                <td>{new Date(item.emOperacaoDesde).toLocaleDateString('pt-BR')}</td>
                                <td style={{ textAlign: "center" }}>
                                    <button className="delete-button" onClick={() => handleEditItem(item.id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <div className="identify-data">
                <h2>Inventário</h2>
                <h3>Fazenda {formData.nomeFazenda}</h3>
            </div>
            <div className="btn-financial-container">
                <button
                    className="financial-button"
                    onClick={() => {
                        setShowPopup(true);
                        setEditIndex(null);
                        setForm({
                            item: '',
                            valor: '',
                            valorFinal: '',
                            novo: 'novo',
                            vidaUtil: '',
                            emOperacaoDesde: ''
                        });
                    }}
                >
                    <div className="icon-wrapper">
                        <FontAwesomeIcon icon={faPlus} className="financial-icon" />
                    </div>
                    <div className="text-financial-wrapper">
                        <span>Lançar Patrimônio</span>
                    </div>
                </button>
                <button
                    className="financial-button"
                    onClick={() => setShowTablePopup(true)}
                >
                    <div className="icon-wrapper">
                        <FontAwesomeIcon icon={faEllipsisH} className="financial-icon" />
                    </div>
                    <div className="text-financial-wrapper">
                        <span>Patrimônio</span>
                    </div>
                </button>

                <h4>Depreciação Mensal: R$ {calculateDepreciation().toLocaleString('pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>

                {showFullTable ? renderTable(inventoryData) : renderTable(summarizedData)}

            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>{editIndex !== null ? 'Editar Patrimônio' : 'Lançar Patrimônio'}</h3>
                        <form onSubmit={handleSubmit} className="harv-form">
                            <label>
                                Item:
                                <input
                                    type="text"
                                    name="item"
                                    value={form.item}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Valor investido:
                                <input
                                    type="number"
                                    name="valor"
                                    value={form.valor}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Valor final:
                                <input
                                    type="number"
                                    name="valorFinal"
                                    value={form.valorFinal}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Novo/Usado:
                                <select
                                    name="novo"
                                    value={form.novo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="novo">Novo</option>
                                    <option value="usado">Usado</option>
                                </select>
                            </label>
                            <label>
                                Vida útil (anos):
                                <input
                                    type="number"
                                    name="vidaUtil"
                                    value={form.vidaUtil}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </label>
                            <label>
                                Em operação desde:
                                <input
                                    type="date"
                                    name="emOperacaoDesde"
                                    value={form.emOperacaoDesde}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <br /><br /><br />
                            <div className="bottom-buttons">
                                <button type="button" onClick={() => setShowPopup(false)} className="cancel-button">Voltar</button>
                                <button type="submit" className="first-class-button">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTablePopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Tabela Completa de Patrimônio</h3>
                        {renderFullTable(inventoryData)}
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowTablePopup(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <IconContainer />

        </div>
    );
};

export default Inventory;
