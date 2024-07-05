// Inventory.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Inventory.css';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faPlus, faListAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { IconContainer, formatDate } from './utils';


const Inventory = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const formData = JSON.parse(localStorage.getItem('formData'));
    const [inventoryData, setInventoryData] = useState([]);
    const [depreciationMonthly, setDepreciationMonthly] = useState(500); // Exemplo de depreciação mensal

    useEffect(() => {
        const storedInventoryData = JSON.parse(localStorage.getItem('inventoryData'));
        if (storedInventoryData) {
            setInventoryData(storedInventoryData);
        }
    }, []);

    const handleAddItem = () => {
        // Implementação para adicionar novo item ao inventário
        setShowPopup(true);
        // Pode-se implementar um formulário modal para adicionar novos itens
    };

    const handleViewInventory = () => {
        navigate('/inventory-list'); // Rota para visualizar todo o patrimônio lançado
    };

    const renderTable = (data = []) => {
        if (!data.length) {
            return <p>Nenhum item registrado no inventário.</p>;
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Valor Investido</th>
                        <th>Novo/Usado</th>
                        <th>Vida Útil</th>
                        <th>Em Operação Desde</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.item}</td>
                            <td>{item.valorInvestido}</td>
                            <td>{item.novoUsado}</td>
                            <td>{item.vidaUtil}</td>
                            <td>{formatDate(item.emOperacaoDesde)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="inventory-container">
            <div className="identify-data">
                <h2>Inventário Patrimonial</h2>
                <h3>Fazenda {formData.nomeFazenda}</h3>
                
            </div>
            <div className="btn-inventory-container">
            <p>Depreciação Mensal: R$ {depreciationMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <button className="inventory-button" onClick={handleAddItem}>
                    <div className="icon-wrapper">
                        <FontAwesomeIcon icon={faPlus} className="inventory-icon" />
                    </div>
                    <div className="text-inventory-wrapper">
                        <span>Novo Lançamento</span>
                    </div>
                </button>

                <button className="inventory-button" onClick={handleViewInventory}>
                    <div className="icon-wrapper">
                        <FontAwesomeIcon icon={faListAlt} className="inventory-icon" />
                    </div>
                    <div className="text-inventory-wrapper">
                        <span>Ver Inventário</span>
                    </div>
                </button>
            </div>

            <IconContainer />

            {showPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        {/* Implementar formulário modal para adicionar novo item */}
                        <h3>Adicionar Novo Item ao Inventário</h3>
                        {/* Campos do formulário */}
                        <button onClick={() => setShowPopup(false)}>Cancelar</button>
                        <button>Salvar</button>
                    </div>
                </div>
            )}

            <div className="inventory-list">
                <h3>Lista de Itens no Inventário</h3>
                {renderTable(inventoryData)}
            </div>
        </div>
    );
};

export default Inventory;
