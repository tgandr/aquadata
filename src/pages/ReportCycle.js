import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDollarSign, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from './utils';
import { IconContainer } from './utils';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ReportCycle = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cultivoId = location.state.id;
    const viveiroName = location.state.viveiro.nome;
    // const farmName = location.state.farmName;
    const cultivo = JSON.parse(localStorage.getItem(cultivoId));
    const stockData = JSON.parse(localStorage.getItem('stockData'));
    const [showStressTest, setShowStressTest] = useState(false);
    const [showBiometrics, setShowBiometrics] = useState(false);
    const [showRacao, setShowRacao] = useState(false);
    const [showParametros, setShowParametros] = useState(false);
    const [showFertilizantes, setShowFertilizantes] = useState(false);
    const [showProducao, setShowProducao] = useState(false);
    let revenue = 0;
    let survivalRate = 0;

    let CA = checkFeedToCA()
    function checkFeedToCA() {
        if ('feed' in cultivo) {
            const feed = cultivo.feed.reduce(
                (total, feed) => total + parseFloat(feed.racaoTotalDia),
                0);
            const biomass = cultivo.harvest.reduce((total, biom) => total +
                (parseInt(biom.data.biomass) || parseInt(biom.data.biomassAtFinalHarvest)), 0);
            return { feed: feed, biomass: biomass }
        }
    }

    const tipoTesteMap = {
        alteracaoSalinidade: "Alteração de Salinidade",
        alteracaoTemperatura: "Alteração de Temperatura"
    };

    const alteracaoNatatoriaMap = {
        pequena: "Pequena",
        media: "Média",
        grande: "Grande"
    };

    const larvasMortasMap = {
        poucas: "Poucas",
        algumas: "Algumas",
        muitas: "Muitas"
    };

    return (
        <div>
            <div className="identify-data">
                <h2>Relatório</h2>
                <h3>{viveiroName}</h3>
            </div>
            <div className="pond-detail">
                <div className="infos">
                    <p><strong>Data de Povoamento:</strong> {formatDate(cultivo.dataPovoamento).date}</p>
                    <p><strong>Origem PL:</strong> {cultivo.origemPL}</p>
                    <p><strong>Quantidade Estocada:</strong> {parseInt(cultivo.quantidadeEstocada).toLocaleString('pt-BR')}</p>
                </div>

                <div className="report-tables">
                    <h3 className="toggle-title" onClick={() => setShowStressTest(!showStressTest)}>
                        Teste de Estresse
                        {showStressTest ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showStressTest && (cultivo.testeEstresse === "Sim" ? (
                        <table className="biometry-table">
                            <thead>
                                <tr>
                                    <th>Tipo de Teste</th>
                                    <th>Alteração Natatória</th>
                                    <th>Larvas Mortas</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: "right" }}>
                                        {tipoTesteMap[cultivo.testForm.tipoTeste]}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {alteracaoNatatoriaMap[cultivo.testForm.alteracaoNatatoria]}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {larvasMortasMap[cultivo.testForm.larvasMortas]}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (<p>Não realizado</p>))}

                    <h3 className="toggle-title" onClick={() => setShowBiometrics(!showBiometrics)}>
                        Biometrias
                        {showBiometrics ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>

                    {showBiometrics && (
                        cultivo.biometrics ? (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Pesagem</th>
                                        <th>Contagem</th>
                                        <th>Peso Médio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivo.biometrics.map((biometric, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(biometric.data).date}</td>
                                            <td style={{ textAlign: "right" }}>{biometric.Pesagem}</td>
                                            <td style={{ textAlign: "right" }}>{biometric.Contagem}</td>
                                            <td style={{ textAlign: "right" }}>{parseFloat(biometric.pesoMedio).toLocaleString('pt-BR',
                                                { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (<p>Sem registros</p>)
                    )}

                    <h3 className="toggle-title" onClick={() => setShowRacao(!showRacao)}>
                        Ração
                        {showRacao ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showRacao && (
                        cultivo.feed ? (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Tratos</th>
                                        <th>Marca</th>
                                        <th>Tipo</th>
                                        <th>Ração Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivo.feed.map((feed, index) => {
                                        const purchase = stockData.feedPurchase.find(
                                            (item) => item.purchaseId.id === parseInt(feed.racaoUsada)
                                        );
                                        return (
                                            <tr key={index}>
                                                <td>{formatDate(feed.data).date}</td>
                                                <td>{feed.quantidadeTratos}</td>
                                                <td>{purchase?.marca || 'N/A'}</td>
                                                <td>{purchase?.tipo || 'N/A'}</td>
                                                <td className="td-revenue">{feed.racaoTotalDia}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}><strong>Total</strong></td>
                                        <td className="td-revenue">
                                            <strong>
                                                {cultivo.feed.reduce(
                                                    (total, feed) => total + parseFloat(feed.racaoTotalDia),
                                                    0
                                                )}
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (<p>Sem registros</p>)
                    )}

                    <h3 className="toggle-title" onClick={() => setShowParametros(!showParametros)}>
                        Parâmetros
                        {showParametros ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showParametros && (
                        cultivo.params ? (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Horário</th>
                                        <th>Temp</th>
                                        <th>OD</th>
                                        <th>pH</th>
                                        <th>Amônia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivo.params.map((param, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(param.data).date}</td>
                                            <td>{param.horario}</td>
                                            <td>{param.temperatura}</td>
                                            <td>{param.oxigenioDissolvido}</td>
                                            <td>{param.ph || '-'}</td>
                                            <td>{param.amoniaTotal || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (<p>Sem registros</p>)
                    )}

                    <h3 className="toggle-title" onClick={() => setShowFertilizantes(!showFertilizantes)}>
                        Fertilizantes
                        {showFertilizantes ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>

                    {showFertilizantes && (
                        cultivo.fertilizers ? (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Tipo</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivo.fertilizers.map((fertilizer, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(fertilizer.data).date}</td>
                                            <td>{fertilizer.tipoFertilizante}</td>
                                            <td>{fertilizer.quantidade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (<p>Sem registros</p>)
                    )}

                    <h3 className="toggle-title" onClick={() => setShowProducao(!showProducao)}>
                        Produção
                        {showProducao ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showProducao && (
                        cultivo.harvest ? (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Data</th>
                                        <th>Tipo</th>
                                        <th>Comprador</th>
                                        <th>Peso Médio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivo.harvest.map((harvest, index) => {
                                        const totalWeight = harvest.data.biometries.reduce((sum, b) => sum + parseFloat(b.weight), 0);
                                        const totalCount = harvest.data.biometries.reduce((sum, b) => sum + parseInt(b.count), 0);
                                        const averageWeight = (totalWeight / totalCount);
                                        survivalRate += (((harvest.data.biomass ||
                                            harvest.data.biomassAtFinalHarvest) * 1000) / averageWeight) / cultivo.quantidadeEstocada;

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{formatDate(harvest.id.date).date}</td>
                                                <td>{harvest.id.totalOrParcial}</td>
                                                <td>{harvest.id.buyer}</td>
                                                <td>{averageWeight.toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 0, maximumFractionDigits: 0 })} g</td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Preço</th>
                                        <th>Produção</th>
                                        <th colSpan="2">Receita</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivo.harvest.map((harvest, index) => {
                                        revenue += parseFloat(harvest.id.price) *
                                            parseInt(harvest.data.biomass || harvest.data.biomassAtFinalHarvest);

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>R$ {parseInt(harvest.id.price).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className="td-revenue">{parseInt(harvest.data.biomass || harvest.data.biomassAtFinalHarvest)
                                                    .toLocaleString('pt-BR')} kg</td>
                                                <td colSpan="2" className="td-revenue">R$ {(parseInt(harvest.data.biomass || harvest.data.biomassAtFinalHarvest) *
                                                    harvest.id.price).toLocaleString('pt-BR',
                                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="total-line" >
                                        <td colSpan="2" style={{ textAlign: "center" }}><strong>Total</strong></td>
                                        <td style={{ textAlign: "right" }}>{(CA.biomass).toLocaleString('pt-BR')} kg</td>
                                        <td colSpan="2" className="td-revenue"><strong>R$ {(revenue).toLocaleString('pt-BR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                                    </tr>
                                    {cultivo.harvest.some((harv) => harv.id.totalOrParcial === "total") && (
                                        <>
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: "center" }}><strong>Sobrevivência</strong></td>
                                                <td colSpan="2" style={{ textAlign: "center" }}>{(parseFloat(survivalRate * 100)).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: "center" }}><strong>Conversão Alimentar</strong></td>
                                                <td colSpan="2" style={{ textAlign: "center" }}>{parseFloat(parseInt(CA.feed) / parseInt(CA.biomass)).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        ) : (<p>Sem registros</p>)
                    )}
                    <br /><br /><br /><br /><br /><br />
                </div>
            </div>
            <IconContainer />
        </div>
    );
};

export default ReportCycle;
