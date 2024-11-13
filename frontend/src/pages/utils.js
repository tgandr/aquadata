// src/utils/utils.js

import { useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDollarSign, faWarehouse, faShrimp } from '@fortawesome/free-solid-svg-icons';

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const today = new Date().getTime();
    const dayStart = new Date(dateString).getTime();
    const days = Math.floor((today - dayStart) / 86400000);
    return {
        date: `${day}/${month}/${year}`,
        days: days
    };
};

export const IconContainer = () => {
    const navigate = useNavigate();

    return (
    <div className="icon-container">
        <div className="icon-container-inner">
            <button className="side-icon-button" onClick={() => navigate(-1)}>
                <div>
                    <FontAwesomeIcon icon={faArrowLeft} className="icon" />
                </div>
                <span className="side-icon-button-text">Voltar</span>
            </button>
            <button className="side-icon-button" onClick={() => navigate('/viveiros')}>
                <div>
                    <FontAwesomeIcon icon={faShrimp} className="icon" />
                </div>
                <span className="side-icon-button-text">Viveiros</span>
            </button>
            <img
                src={aquaDataIcon}
                alt="Aqua Data Icon"
                style={{ width: '100px', height: '100px' }}
                onClick={() => navigate('/dashboard')}
                className="centered-image" />
            <button className="side-icon-button" onClick={() => navigate('/estoque')}>
                <div>
                    <FontAwesomeIcon icon={faWarehouse} className="icon" />
                </div>
                <span className="side-icon-button-text">Estoque</span>
            </button>
            <button className="side-icon-button" onClick={() => navigate('/financeiro')}>
                <div>
                    <FontAwesomeIcon icon={faDollarSign} className="icon" />
                </div>
                <span className="side-icon-button-text">Financeiro</span>
            </button>
        </div>
    </div>
    )
}

export const calculateDepreciation = (hasShrimp) => {
    const inventoryData = JSON.parse(localStorage.getItem("inventoryData"));
    if (hasShrimp && inventoryData) {
        return inventoryData.reduce((total, item) => {
            const meses = parseInt(item.vidaUtil, 10) * 12;
            const valorInicial = parseFloat(item.valor);
            const valorFinal = parseFloat(item.valorFinal);
            const valorMensal = (valorInicial - valorFinal) / meses;
            return total + valorMensal;
        }, 0);
    }; // ajustar para calcular e não atualizar em cultivos encerrados
    };
