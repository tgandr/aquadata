import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from './utils';
import { IconContainer } from './utils';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ReportFinancial = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const farmName = location.state.farmName;
    const financial = JSON.parse(localStorage.getItem('financial'));
    const [showStressTest, setShowStressTest] = useState(false);

    

    return (
        <div>
            <div className="identify-data">
                <h2>Relatório</h2>
                <h3>Mês {/*month*/}</h3>
            </div>
            <div className="pond-detail">
                <div className="infos">
                    
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
                    {/* {showStressTest && (cultivo.testeEstresse === "Sim" ? (
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
                </div>
            </div>        
            <IconContainer />
        </div>
    );
};

export default ReportFinancial;
