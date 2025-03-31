import React, { useState, useEffect } from 'react';
import { formatDate, IconContainer } from './utils';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { calculateDepreciation } from './utils';
import useDatabase from '../hooks/useDatabase';

const PondCosts = () => {
    const db = useDatabase()
    const location = useLocation();
    const { dataPovoamento, feed, viveiro, viveiroId, hasShrimp,
        harvest, depreciationTotal, id, fertilizers } = location.state.cycle;
    const [financial, setFinancial] = useState({})
    const [showFixedCosts, setShowFixedCosts] = useState(false);
    const [showVariableCosts, setShowVariableCosts] = useState(false);
    const [showTotalCosts, setShowTotalCosts] = useState(false);
    const [costs, setCosts] = useState({
        fixeds: {
            labor: { name: "Mão-de-obra", value: 0 },
            depreciation: { name: "Depreciação", value: 0 },
            others: { name: "Outros", value: 0 }
        },
        variables: {
            feed: { name: "Ração", value: 0 },
            fertilization: { name: "Fertilização", value: 0 },
            probiotics: { name: "Probióticos", value: 0 },
            postLarvae: { name: "Pós-larvas", value: 0 },
            electricity: { name: "Energia Elétrica", value: 0 },
            others: { name: 'Outros', value: 0 }
        }
    });
    const [ponds,setPonds] = useState([])
    const [currentPond, setCurrentPond] = useState({})
    const [totalPondsArea, setTotalPondsArea] = useState() 
    const [isLoaded, setIsLoaded] = useState(false)
    const [pondArea, setPondArea] = useState()
    const [pondPercentage, setPondPercentage] = useState()

    useEffect(() => {
        if (!db) return
        console.log(location.state)
        db.find({
            selector: {dataType: 'financial'}
        }).then(data => {
            console.log(data)
            setFinancial(data.docs[0])
        })

        db.find({
            selector: {dataType: 'pond'}
        }).then(data => {
            const mappedPonds = data.docs.map(p =>({
                id: p._id,
                nome: p.name,
                area: p.area
            }))
            const currentPond = mappedPonds.find(p => p.id == viveiroId)
            const currentPondArea = parseFloat(currentPond.area)
            setCurrentPond(currentPond)
            setPonds(mappedPonds)
            setTotalPondsArea(mappedPonds.reduce((total, i) => 
                total + parseFloat(i.area), 0))
            setPondArea(currentPondArea)
            setPondPercentage(parseFloat((currentPondArea / totalPondsArea) * 100))
            setIsLoaded(true)
        })
    }, [db]) 

    const searchHarvestDate = () => {
        const finalHarvestDate = harvest && harvest.find(harv => harv.id.totalOrParcial === "total")?.id.date;
        return finalHarvestDate ? formatDate(finalHarvestDate).date : "";
    };

    const calculateFeedCosts = () => {
        let cost = 0;
        feed && feed.forEach(feedEntry => {
            const purchase = financial.feedPurchase.find(item => item.purchaseId.id === feedEntry.racaoUsada);
            if (purchase) {
                cost += parseFloat(purchase.value / purchase.bagSize) * parseFloat(feedEntry.racaoTotalDia);
            }
        });
        return cost;
    };

    const calculateFertilizersCosts = () => {
        let fert = 0;
        if (!financial) 
            return 0;
        
        fertilizers && fertilizers.forEach(fEntry => {
            const purchase = financial.fertilizersPurchase.find(item => item.id === fEntry.id);
            if (purchase) {
                fert += parseFloat(purchase.value / purchase.quantity) * parseFloat(fEntry.quantidade);
            }
        });
        return fert;
    };

    const calculateProbioticsCosts = () => {
        let prob = 0;
        fertilizers && fertilizers.forEach(fEntry => {
            const purchase = financial.probioticsPurchase.find(item => item.id === fEntry.id);
            if (purchase) {
                // prob += parseFloat(purchase.value / purchase.quantity) * parseFloat(fEntry.quantidade);
                const checkUnitFertilizerEntry = fEntry.unidade && fEntry.unidade.toLowerCase();
                const checkUnitPurchase = purchase.unity && purchase.unity.toLowerCase();

                if (fEntry.unidade === ("grama" || "Grama") && purchase.unity === ("quilo" || "Quilo")) {
                    prob += parseFloat(purchase.value / purchase.quantity) * parseFloat(fEntry.quantidade / 1000);
                };
                //if (fEntry.unidade === purchase.unity) {
                if (checkUnitFertilizerEntry === checkUnitPurchase) {
                    prob += parseFloat(purchase.value / purchase.quantity) * parseFloat(fEntry.quantidade);
                };
            }
        });
        return prob;
    };

    const calculateEnergyCost = () => {
        const startDate = new Date(dataPovoamento);
        const endDate = hasShrimp ? new Date() : new Date(harvest.find(harv => harv.id.totalOrParcial === "total")?.id.date);
        // const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        let totalEnergyCost = 0;
        const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
        
        if (!financial.payments) return 0;
        
        financial.payments.forEach(entry => {
            const entryDate = new Date(entry.month + "-01"); // Convert month string to date
            if (entryDate >= startDate && entryDate <= endDate) {
                if (entry.energia) {
                    const entryYear = entryDate.getFullYear();
                    const entryMonth = entryDate.getMonth() + 1;
                    const daysInMonth = getDaysInMonth(entryYear, entryMonth);
                    const monthlyCost = entry.energia.reduce((t, i) => t + parseFloat(i.value), 0);
                    const dailyCost = monthlyCost / daysInMonth;
                    totalEnergyCost += dailyCost * daysInMonth;
                }
            }
        });

        const proportionalCost = totalEnergyCost * (pondArea / totalPondsArea);
        return proportionalCost;
    };


    const calculateLaborCost = () => {
        const startDate = new Date(dataPovoamento);
        const endDate = hasShrimp
            ? new Date()
            : new Date(harvest.find(harv => harv.id.totalOrParcial === "total")?.id.date);
        // const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        let totalLaborCost = 0;
        const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

        if (!financial.labor) return 0;

        financial.labor.forEach(entry => {
            const entryDate = new Date(entry.month + "-01");
            if (entryDate >= startDate && entryDate <= endDate) {
                entry.payroll.forEach(payrollEntry => {
                    const entryYear = entryDate.getFullYear();
                    const entryMonth = entryDate.getMonth() + 1;
                    const daysInMonth = getDaysInMonth(entryYear, entryMonth);
                    const monthlyCost = parseFloat(payrollEntry.salary);
                    const dailyCost = monthlyCost / daysInMonth;
                    totalLaborCost += dailyCost * daysInMonth;
                });
            }
        });
        return totalLaborCost * (pondPercentage / 100);
    };

    const calculatePostLarvaeCosts = () => {
        if (!financial) return 0;

        const { postLarvaePurchase } = financial;
        let plCosts = {};
        if (postLarvaePurchase) {
            plCosts = postLarvaePurchase.find(l => l.dateIn === id);
        }
        // let currentCost = 0;
        if (plCosts) {
            return plCosts.value * plCosts.quantity;
        }
    };

    const calculateOtherFixedsCosts = () => {
        if (!financial) return 0;
        const { payments } = financial;
        const startDate = new Date(dataPovoamento);
        const endDate = hasShrimp ? new Date() : new Date(harvest.find(harv => harv.id.totalOrParcial === "total")?.id.date);
        let others = 0;
        payments && payments.forEach((item) => {
            const entryDate = new Date(item.month + "-01");
            if (entryDate >= startDate && entryDate <= endDate) {
                if (item.outros) {
                    item.outros.forEach((i) => {
                        if (i.distribution === "y") {
                            others += parseFloat(i.value * (pondArea / totalPondsArea));
                        } else {
                            others += parseFloat(i.viveiroDistribution[viveiroId])
                        }
                    })
                }
            }
        });
        return others;
    };

    const formatCurrency = (value) => {
        if (value) {
            return `R$ ${value.toLocaleString('pt-BR',
                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        } else {
            return "R$ 0,00";
        }
    };

    const totalVariableCosts = () => {
        return Object.values(costs.variables).reduce((acc, curr) => acc + curr.value, 0);
    };

    const totalFixedsCosts = () => {
        return Object.values(costs.fixeds).reduce((acc, curr) => acc + curr.value, 0);
    };

    const calculateRevenues = () => {
        if (harvest) {
            const rev = harvest.reduce((total, index) => total + (parseFloat(index.id.price) *
                parseFloat(index.data.biomass || index.data.biomassAtFinalHarvest)), 0);
            return rev;
        } else { return 0 };
    };

    useEffect(() => {
        const feedCost = calculateFeedCosts();
        const energyCost = calculateEnergyCost();
        const laborCost = calculateLaborCost();
        const postLarvaeCost = calculatePostLarvaeCosts();
        const fertilizersCosts = calculateFertilizersCosts();
        const probioticsCosts = calculateProbioticsCosts();
        const others = calculateOtherFixedsCosts();
        const depreciation = calculateDepreciation(hasShrimp) * pondPercentage / 100;
        setCosts(prevCosts => ({
            fixeds: {
                labor: { ...costs.fixeds.labor, value: laborCost },
                depreciation: {...costs.fixeds.depreciation, value: depreciation},
                // depreciation: prevCosts.fixeds.depreciation,

                others: {...costs.fixeds.others, value: others}
            },
            variables: {
                ...prevCosts.variables,
                feed: { name: "Ração", value: feedCost },
                electricity: { name: "Energia Elétrica", value: energyCost },
                postLarvae: { name: "Pós-larvas", value: postLarvaeCost },
                fertilization: { name: "Fertilizantes", value: fertilizersCosts },
                probiotics: { name: "Probióticos", value: probioticsCosts }
            }
        }));
    }, []);
    if (!isLoaded) return <p>Carregando...</p>
    return (
        <div>
            <div className="identify-data">
                <h2>Viveiro {viveiro}</h2>
                <h3>{formatDate(dataPovoamento).date}
                    {!hasShrimp && (` a ${searchHarvestDate()}`)}
                </h3>
            </div>
            <div className="pond-detail">
                <div className="infos"><h3>
                    {`${parseFloat(currentPond.area).toLocaleString('pt-BR',
                        { minimumFractionDigits: 1, maximumFractionDigits: 1 })} `}
                    ha - {`${parseFloat(currentPond.area / totalPondsArea * 100).toLocaleString('pt-BR',
                        { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% da área total`}</h3></div>
                <div className="infos">Área total de viveiros: {`${totalPondsArea.toLocaleString('pt-BR',
                    { minimumFractionDigits: 1, maximumFractionDigits: 1 })} `}
                    ha</div>
                {/* <div className="infos">Área do viveiro: {`${parseFloat(pond.area).toLocaleString('pt-BR',
                    { minimumFractionDigits: 1, maximumFractionDigits: 1 })} `}
                    ha, {`${parseFloat(pond.area / totalPondsArea * 100).toLocaleString('pt-BR',
                    { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% `}</div>  */}
                {/* <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Informações do Viveiro</h5>
                        <p className="card-text">
                            <strong>Área total de viveiros:</strong> {`${totalPondsArea.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ha`}
                        </p>
                        <p className="card-text">
                            <strong>Área do viveiro:</strong> {`${parseFloat(pond.area).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ha`}
                            <br />
                            <strong>Porcentagem da área total:</strong> {`${parseFloat((pond.area / totalPondsArea) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`}
                        </p>
                    </div>
                </div> */}

                {/* <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Informações do Viveiro</h5>
                        <div className="card-text mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <i className="fas fa-water fa-lg mr-2 text-primary"></i>
                                <strong>Área total de viveiros:</strong>
                            </div>
                            <div className="ml-4">
                                {`${totalPondsArea.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                })} ha`}
                            </div>
                        </div>
                        <div className="card-text mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <i className="fas fa-fish fa-lg mr-2 text-info"></i>
                                <strong>Área do viveiro:</strong>
                            </div>
                            <div className="ml-4">
                                {`${pondArea.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                })} ha`}
                            </div>
                        </div>
                        <div className="card-text">
                            <div className="d-flex align-items-center mb-2">
                                <i className="fas fa-percentage fa-lg mr-2 text-success"></i>
                                <strong>Porcentagem da área total:</strong>
                            </div>
                            <div className="ml-4">
                                {`${pondPercentage.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                })}%`}
                            </div>
                            <div className="progress mt-2" style={{ height: '20px' }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${pondPercentage}%` }}
                                    aria-valuenow={pondPercentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    {`${pondPercentage.toFixed(1)}%`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

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
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Descrição</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Adicionar custos fixos aqui */}
                                    <tr>
                                        <td>
                                            Depreciação
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            {hasShrimp
                                                ? formatCurrency(calculateDepreciation(hasShrimp) * pondPercentage / 100)
                                                : formatCurrency(depreciationTotal)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Mão de Obra</td>
                                        <td style={{ textAlign: "right" }}>{formatCurrency(calculateLaborCost())}</td>
                                    </tr>
                                    <tr>
                                        <td>Outros</td>
                                        {/* Adicionar ao código a possibilidade de exibir os custos e mover um custo fixo específico para variável */}
                                        <td style={{ textAlign: "right" }}>{formatCurrency(calculateOtherFixedsCosts())}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Custos Fixos</strong></td>
                                        <td style={{ textAlign: "right" }}><strong>{formatCurrency(totalFixedsCosts())}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="cost-section">
                        <h3 className="toggle-title" onClick={() => setShowVariableCosts(!showVariableCosts)}>
                            Custos Variáveis
                            {showVariableCosts ? (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                            )}
                        </h3>
                        {showVariableCosts && (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Descrição</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                {/* fazer um map para diferentes custos variáveis*/}
                                {/* <tbody>
                                    <tr>
                                        <td>{costs.variables.feed.name}</td>
                                        <td style={{ textAlign: "right" }}>{formatCurrency(costs.variables.feed.value)}</td>
                                    </tr>
                                    <tr>
                                        <td>Pós-larvas</td>
                                        <td style={{ textAlign: "right" }}>{formatCurrency()}</td>
                                    </tr>
                                    <tr>
                                        <td>Energia Elétrica</td>
                                        <td style={{ textAlign: "right" }}>{formatCurrency()}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Custos Variáveis</strong></td>
                                        <td style={{ textAlign: "right" }}><strong>{formatCurrency(totalVariableCosts())}</strong></td>
                                    </tr> */}
                                {/* Adicionar outros custos variáveis aqui */}
                                {/* </tbody> */}

                                <tbody>
                                    {Object.keys(costs.variables).map((key) => (
                                        costs.variables[key].value !== 0 && <tr key={key}>
                                            <td>{costs.variables[key].name}</td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(costs.variables[key].value)}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td><strong>Custos Variáveis</strong></td>
                                        <td style={{ textAlign: "right" }}><strong>{formatCurrency(totalVariableCosts())}</strong></td>
                                    </tr>
                                </tbody>

                            </table>
                        )}
                        {/* Total Costs */}
                        <h3 className="toggle-title" onClick={() => setShowTotalCosts(!showTotalCosts)}>
                            Saldo
                            {showTotalCosts ? (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                            )}
                        </h3>
                        {showTotalCosts && (
                            <div className="total-cost">
                                <table className="biometry-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Custos Fixos</td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(totalFixedsCosts())}</td>
                                        </tr>
                                        <tr>
                                            <td>Custos Variáveis</td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(totalVariableCosts())}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>CUSTO TOTAL</strong></td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(parseFloat(totalFixedsCosts()) +
                                                parseFloat(totalVariableCosts()))}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>RECEITAS</strong></td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(calculateRevenues())}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>SALDO</strong></td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(calculateRevenues() - (parseFloat(totalFixedsCosts()) +
                                                parseFloat(totalVariableCosts())))}</td>
                                        </tr>
                                    </tbody>
                                </table>
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
