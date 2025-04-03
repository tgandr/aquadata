import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from './utils';
import { IconContainer } from './utils';
import useDatabase from '../hooks/useDatabase';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ReportCycle = () => {
    const db = useDatabase()
    const location = useLocation();
    const cultivoId = location.state.id;
    const pond = location.state.viveiro
    const viveiroName = location.state.viveiro.nome;
    // const findInHistory = () => {
    //     const history = JSON.parse(localStorage.getItem("history"));
    //     const idWithoutPrefix = cultivoId.split("-").slice(1).join("-");
    //     return history.find((cult) => cult.id === idWithoutPrefix)
    // }
    const [cultivation, setCultivation] = useState()
    const [CA, setCA] = useState()
    // const stockData = JSON.parse(localStorage.getItem('stockData'));
    const [stockData, setStock] = useState()
    const [showReceiptPostLarvaes, setShowReceiptPostLarvaes] = useState(false);
    const [showStressTest, setShowStressTest] = useState(false);
    const [showBiometrics, setShowBiometrics] = useState(false);
    const [showRacao, setShowRacao] = useState(false);
    const [showParametros, setShowParametros] = useState(false);
    const [showFertilizantes, setShowFertilizantes] = useState(false);
    const [showProducao, setShowProducao] = useState(false);
    let revenue = 0;
    let survivalRate = 0;

    useEffect(() => {
        if (!db) return 
        db.get(cultivoId).then(res =>{
            setCultivation(res)
            console.log(checkFeedToCA(res))
            setCA(checkFeedToCA(res))
        })

        db.find({
            selector: {dataType: 'stockData'}
        }).then(data => {
            const stock = data.docs[0]
            setStock(stock || {})
        })
    },[db])

    function checkFeedToCA(cultivation) {
        if ('feed' in cultivation) {
            const feed = cultivation.feed.reduce(
                (total, feed) => total + parseFloat(feed.racaoTotalDia),
                0);
            const biomass = cultivation.harvest ? cultivation.harvest.reduce((total, biom) => total +
                (parseInt(biom.data.biomass) || parseInt(biom.data.biomassAtFinalHarvest)), 0) : 0;
            return { feed: feed, biomass: biomass }
        }
        // pegar erro para o caso de não haver lançamento de ração
    }

    const tipoTesteMap = {
        alteracaoSalinidade: "Alteração de Salinidade",
        alteracaoTemperatura: "Alteração de Temperatura",
        aguaViveiro: "Com água do viveiro"
    };

    const alteracaoNatatoriaMap = {
        pequena: "Pequena",
        media: "Média",
        grande: "Grande",
        nenhuma: "Nenhuma"
    };

    const larvasMortasMap = {
        poucas: "Poucas",
        algumas: "Algumas",
        muitas: "Muitas",
        nenhuma: "Nenhuma"
    };

    const produtividade = () => {
        if (!CA) return 0
        // const viv = JSON.parse(localStorage.getItem('viveiros')).find(v => v.id == cultivation.viveiroId)
        return parseInt(CA.biomass / pond.area)
    };

    return (
        cultivation && (
        <div>
            <div className="identify-data">
                <h2>Relatório</h2>
                <h3>{viveiroName}</h3>
            </div>
            <div className="pond-detail">
                <div className="infos">
                    <p><strong>Data de Povoamento:</strong> {formatDate(cultivation.dataPovoamento).date}</p>
                    <p><strong>Origem PL:</strong> {cultivation.origemPL}</p>
                    <p><strong>Quantidade Estocada:</strong> {parseInt(cultivation.quantidadeEstocada).toLocaleString('pt-BR')}</p>
                </div>

                <div className="report-tables">
                    <h3 className="toggle-title" onClick={() => setShowReceiptPostLarvaes(!showReceiptPostLarvaes)}>
                        Recebimento das pós-larvas
                        {showReceiptPostLarvaes ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showReceiptPostLarvaes &&
                        <>
                            {cultivation.uniformidade === 'desuniforme' ?
                                <p style={{ textAlign: 'left' }}>As pós-larvas eram desuniformes no recebimento</p>
                                : <p style={{ textAlign: 'left' }}>Uniformidade <strong>{cultivation.uniformidade}</strong> no recebimento</p>}
                            {cultivation.testForm ?
                                (<table className="biometry-table">
                                    <thead>
                                        <tr>
                                            <th>Teste de estresse</th>
                                            <th>Alteração Natatória</th>
                                            <th>Larvas Mortas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>
                                                {tipoTesteMap[cultivation.testForm.tipoTeste]}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                {alteracaoNatatoriaMap[cultivation.testForm.alteracaoNatatoria]}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                {larvasMortasMap[cultivation.testForm.larvasMortas]}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                ) : (<p style={{ textAlign: 'left' }}>Teste de estresse não realizado</p>)}
                            {cultivation.formParam && (cultivation.formParam.details === "true" ?
                                <>
                                    <table className="biometry-table">
                                        <thead>
                                            <tr>
                                                <th>Parâmetro</th>
                                                <th>Transporte</th>
                                                <th>Viveiro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: "left" }}>
                                                    Oxigênio
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.oxygen.transp} mg/L
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.oxygen.pond} mg/L
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: "left" }}>
                                                    Temperatura
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.temperature.transp} °C
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.temperature.pond} °C
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: "left" }}>
                                                    pH
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.ph.transp}
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.ph.pond}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: "left" }}>
                                                    Salinidade
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.salinity.transp} g/L
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.salinity.pond} g/L
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: "left" }}>
                                                    Amônia
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.ammonium.transp} mg/L
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.ammonium.pond} mg/L
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: "left" }}>
                                                    Nitrito
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.nitrite.transp} mg/L
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    {cultivation.formParam.nitrite.pond} mg/L
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </> : 
                                (cultivation.formParam.check === 'true'
                                    ? <p style={{ textAlign: 'left' }}>A checagem de parâmetros foi realizada mas não foi detalhada</p>
                                    : <p style={{ textAlign: 'left' }}>Não foi feita a checagem de parâmetros de água no recebimento</p>)
                            )}
                            <br />
                        </>
                    }

                    {/* <h3 className="toggle-title" onClick={() => setShowStressTest(!showStressTest)}>
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
                    ) : (<p>Não realizado</p>))} */}

                    <h3 className="toggle-title" onClick={() => setShowRacao(!showRacao)}>
                        Ração
                        {showRacao ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showRacao && (
                        cultivation.feed ? (
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
                                    {cultivation.feed.map((feed, index) => {
                                        const purchase = stockData.feedPurchase.find(
                                            (item) => item.purchaseId.id === feed.racaoUsada
                                        );
                                        return (
                                            <tr key={index}>
                                                <td>{formatDate(feed.data).date}</td>
                                                <td>{feed.quantidadeTratos}</td>
                                                <td>{purchase?.brand || 'N/A'}</td>
                                                <td>{purchase?.type || 'N/A'}</td>
                                                <td className="td-revenue">{feed.racaoTotalDia}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}><strong>Total</strong></td>
                                        <td className="td-revenue">
                                            <strong>
                                                {cultivation.feed.reduce(
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
                        Parâmetros da Água
                        {showParametros ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showParametros && (
                        cultivation.params ? (
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
                                    {cultivation.params.map((param, index) => (
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

                    <h3 className="toggle-title" onClick={() => setShowBiometrics(!showBiometrics)}>
                        Biometrias
                        {showBiometrics ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>

                    {showBiometrics && (
                        cultivation.biometrics ? (
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
                                    {cultivation.biometrics.map((biometric, index) => (
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

                    <h3 className="toggle-title" onClick={() => setShowFertilizantes(!showFertilizantes)}>
                        Fertilização
                        {showFertilizantes ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>

                    {showFertilizantes && (
                        cultivation.fertilizers ? (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Tipo</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivation.fertilizers.map((fertilizer, index) => (
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
                        Despescas
                        {showProducao ? (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                        )}
                    </h3>
                    {showProducao && (
                        cultivation.harvest ? (
                            <table className="biometry-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Data</th>
                                        <th>Despesca</th>
                                        <th>Comprador</th>
                                        <th>Peso Médio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cultivation.harvest.map((harvest, index) => {
                                        const totalWeight = harvest.data.biometries.reduce((sum, b) => sum + parseFloat(b.weight), 0);
                                        const totalCount = harvest.data.biometries.reduce((sum, b) => sum + parseInt(b.count), 0);
                                        const averageWeight = (totalWeight / totalCount);
                                        survivalRate += (((harvest.data.biomass ||
                                            harvest.data.biomassAtFinalHarvest) * 1000) / averageWeight) / cultivation.quantidadeEstocada;

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
                                    {cultivation.harvest.map((harvest, index) => {
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
                                        {/* <td style={{ textAlign: "right" }}>{CA ? (CA.biomass).toLocaleString('pt-BR') `kg` :
                                            "Sem consumo de ração registrado"}</td> */}
                                        <td style={{ textAlign: "right" }}>
                                            {cultivation.harvest ?
                                                `${(cultivation.harvest.reduce((total, biom) => {
                                                    const biomass = parseInt(biom.data.biomass) || parseInt(biom.data.biomassAtFinalHarvest) || 0;
                                                    return total + biomass;
                                                }, 0)).toLocaleString('pt-BR')} kg`
                                                : 0}
                                        </td>
                                        <td colSpan="2" className="td-revenue"><strong>R$ {(revenue).toLocaleString('pt-BR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                                    </tr>
                                    {cultivation.harvest.some((harv) => harv.id.totalOrParcial === "total") && (
                                        <>
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: "center" }}><strong>Sobrevivência</strong></td>
                                                <td colSpan="2" style={{ textAlign: "center" }}>{(parseFloat(survivalRate * 100)).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: "center" }}><strong>Conversão Alimentar</strong></td>
                                                <td colSpan="2" style={{ textAlign: "center" }}>{CA ? parseFloat(parseInt(CA.feed) / parseInt(CA.biomass)).toLocaleString('pt-BR',
                                                    { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "-"}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: "center" }}><strong>Produtividade</strong></td>
                                                <td colSpan="2" style={{ textAlign: "center" }}>{produtividade().toLocaleString('pt-BR')} kg/ha</td>
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

    ));
    
};

export default ReportCycle;
