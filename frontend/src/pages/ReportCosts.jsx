import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate, IconContainer } from './utils';
import useDatabase from '../hooks/useDatabase'

const ReportCosts = () => {
    const db = useDatabase()
    const [showPondHistory, setShowPondHistory] = useState(false);
    const [pondHistory, setPondHistory] = useState([]);
    const [history, setHistory] = useState([])
    const [ponds, setPonds] = useState([])

    useEffect(() => {
        if (!db) return

        db.find({
            selector: {dataType: 'cultivation'}
        }).then(data => {
            setHistory(data.docs)
        })

        db.find({
            selector: {dataType: 'pond'}
        }).then(data => {
            setPonds(data.docs.map(p => ({
                id: p._id,
                nome: p.name,
                area: p.area
            })))
        })
    },[db])

    const handleClick = (id) => {
        const historyFiltered = history.filter(p => p.viveiroId === id)
        setPondHistory(historyFiltered);
        setShowPondHistory(!showPondHistory);
    };

    return (
        <div>
            <div className="identify-data">
                <h2>Relatório de Custos</h2>
                <h3>2024</h3>
            </div>
            <div className="pond-detail">
                <div className="infos"></div>
                <div className="viveiros-container">
                    {ponds.length > 0 ? (
                        ponds.map((viveiro, i) => (
                            <React.Fragment key={i}>
                                <button
                                    className="viveiro-button"
                                    onClick={() => handleClick(viveiro.id)}>
                                    <div className="infos-wrapper">
                                        {viveiro.id && (
                                            <span className="viveiro-data">
                                                {`${(history.filter(h => h.viveiroId === viveiro.id)).length !== 0
                                                    ? ((history.filter(h => h.viveiroId === viveiro.id)).length === 1
                                                        ? "1 cultivo anterior"
                                                        : `${(history.filter(h => h.viveiroId === viveiro.id)).length} cultivos anteriores`)
                                                    : "Nenhum cultivo registrado"}`
                                                }
                                            </span>
                                        )}
                                        <span className="viveiro-data">{parseFloat(viveiro.area).toLocaleString('pt-BR', {
                                            minimumFractionDigits: 1,
                                            maximumFractionDigits: 1,
                                        })} ha</span>
                                    </div>
                                    <div className="text-add-pond-wrapper">
                                        <span className="viveiro-titulo">{viveiro.nome}</span>
                                    </div>
                                </button>
                            </React.Fragment>
                        ))
                    ) : (
                        <>
                            <h3>Nenhum viveiro cadastrado</h3>
                            <br />
                        </>
                    )}
                    <br /><br />
                </div>
            </div>

            {showPondHistory &&
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Escolha o cultivo</h3>
                        {pondHistory.map((cycle, index) => (
                            <Link
                                to={`/custos/${cycle._id}`}
                                state={{ cycle: cycle }}
                                key={cycle._id}
                                className="link-style">
                                <button key={index}>
                                    {formatDate(cycle.dataPovoamento).date}
                                </button>
                            </Link>
                        ))}
                        <br /><br /><br /><br />
                        <div className="bottom-buttons">
                            <button
                                type="button"
                                onClick={() => (setShowPondHistory(!showPondHistory))}
                                className="cancel-button">
                                Voltar
                            </button>
                        </div>

                    </div>
                </div>}
            <IconContainer />
        </div>
    );
};


export default ReportCosts;
