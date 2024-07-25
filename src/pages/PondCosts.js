import React, { useState } from 'react';
import { formatDate, IconContainer } from './utils';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const PondCosts = () => {
    const location = useLocation();
    const { dataPovoamento, feed, viveiro, hasShrimp, harvest } = location.state.cycle;
    const financial = JSON.parse(localStorage.getItem('financial'));
    const [showFixedCosts, setShowFixedCosts] = useState(false);
    const [showVariableCosts, setShowVariableCosts] = useState(false);
    const [showTotalCosts, setShowTotalCosts] = useState(false);

    const searchHarvestDate = () => {
        const finalHarvestDate = harvest.find(harv => harv.id.totalOrParcial === "total")?.id.date;
        return finalHarvestDate ? formatDate(finalHarvestDate).date : "";
    };

    const calculateFeedCosts = () => {
        let totalCost = 0;
        feed.forEach(feedEntry => {
            const purchase = financial.feedPurchase.find(item => item.purchaseId.id === feedEntry.racaoUsada);
            if (purchase) {
                totalCost += parseFloat(purchase.value) * parseFloat(feedEntry.racaoTotalDia);
            }
        });
        return totalCost.toFixed(2);
    };

    return (
        <div>
            <div className="identify-data">
                <h2>Viveiro {viveiro}</h2>
                <h3>{formatDate(dataPovoamento).date}
                    {!hasShrimp && (` a ${searchHarvestDate()}`)}
                </h3>
            </div>
            <div className="pond-detail">
                <div className="infos"></div>
                <div className="report-tables">
                    <div className="cost-section">
                        <h3 className="toggle-title" onClick={() => setShowFixedCosts(!showFixedCosts)}>
                            Custos Fixos
                            {showFixedCosts ? (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                            )}
                        </h3>
                        {showFixedCosts && (
                            <table className="cost-table">
                                <thead>
                                    <tr>
                                        <th>Descrição</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Adicionar custos fixos aqui */}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="cost-section">
                        <h3 className="toggle-title" onClick={() => setShowVariableCosts(!showVariableCosts)}>
                            Custos Variáveis
                            {showFixedCosts ? (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                            )}
                        </h3>
                        {showVariableCosts && (
                            <table className="cost-table">
                                <thead>
                                    <tr>
                                        <th>Descrição</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Ração</td>
                                        <td>{feed && calculateFeedCosts()}</td>
                                    </tr>
                                    {/* Adicionar outros custos variáveis aqui */}
                                </tbody>
                            </table>
                        )}
                        {/* Total Costs */}
                        <h3 className="toggle-title" onClick={() => setShowTotalCosts(!showTotalCosts)}>
                            Custo Total
                            {showTotalCosts ? (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                            )}
                        </h3>
                        {showTotalCosts && (
                            <div className="total-cost">
                                <p>R$ 1500,00</p> {/* Exemplo de custo total, ajuste conforme necessário */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <IconContainer />
        </div>
    );
};

export default PondCosts;
