import React, { useState, useEffect } from 'react';
import '../styles/SanityAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const SanityAnalysis = ({ setShowAnalysisPopup, showAnalysisPopupPrevious, setShowAnalysisPopupPrevious }) => {
    const [showForm, setShowForm] = useState(false);
    const [checkScreen, setCheckScreen] = useState(false);
    const [storedPonds, setStoredPonds] = useState({});
    const [analysisId, setAnalysisId] = useState({
        origin: '',
        pond: '',
        date: new Date().toISOString().split('T')[0],
        shrimpsPinned: false
    })
    const [analysis, setAnalysis] = useState({
        id: {},
        samples: []
    });
    const [formAnalysis, setFormAnalysis] = useState({
        sampleId: '',
        peso: '',
        conformacaoAntenas: '',
        uropodos: '',
        necrosesIMNV: '',
        tempoCoagulacao: '',
        analiseCefalotorax: '',
        integridadeTubulos: '',
        presencaLipideos: '',
        conteudoTrato: '',
        replecaoTrato: '',
        branquiasEpicomensais: '',
        epipoditoEpicomensais: '',
        necroseIMNV: '',
        necroseBlackspot: '',
    });

    const handleAnalysisChange = (e) => {
        const { name, value } = e.target;
        setFormAnalysis({ ...formAnalysis, [name]: value });
    };

    const handleAnalysisChangeClick = (e, obs, value) => {
        e.preventDefault();
        setFormAnalysis({ ...formAnalysis, [obs]: value });
    };

    const handleAnalysisSubmit = (e) => {
        e.preventDefault();
        const sampleId = analysis.samples.length + 1;
        const sample = { ...formAnalysis, sampleId: sampleId }
        if (analysis.id.origin) {
            setAnalysis({ ...analysis, samples: [...analysis.samples, sample] })
        } else {
            setAnalysis({ id: analysisId, samples: [sample] })
        }
        setFormAnalysis({
            sampleId: '',
            peso: '',
            conformacaoAntenas: '',
            uropodos: '',
            necrosesIMNV: '',
            camaroesGrampados: '',
            tempoCoagulacao: '',
            analiseCefalotorax: '',
            integridadeTubulos: '',
            presencaLipideos: '',
            conteudoTrato: '',
            replecaoTrato: '',
            branquiasEpicomensais: '',
            epipoditoEpicomensais: '',
            necroseIMNV: '',
            necroseBlackspot: '',
        });
        setCheckScreen(true);
        setShowForm(false);
        console.log(analysis)
    };

    const handleStartSample = () => {
        // setStartSample(false);
        setShowAnalysisPopupPrevious({ start: false, previous: false })
        setShowForm(true);
    }

    const onClose = () => {
        setCheckScreen(false);
        setShowForm(true);
    };

    useEffect(() => {
        if (checkScreen) {
            const timer = setTimeout(onClose, 2000);
            return () => clearTimeout(timer);
        }
    }, [checkScreen]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('history')) || {};
        if (storedData) {
            setStoredPonds(storedData);
        }
    }, []);

    const logoutSanity = () => {
        const sampleId = analysis.samples.length + 1;
        const sample = { ...formAnalysis, sampleId: sampleId }
        saveData({ ...analysis, samples: [...analysis.samples, sample] }, 'sanity')
        setShowForm(false);
        setShowAnalysisPopupPrevious({ start: true, previous: false })
        // implementar código para não deixar salvar um único camarão
    }

    const saveData = (data, key) => {
        const storedCultivos = JSON.parse(localStorage.getItem(`history`));
        const i = storedCultivos && storedCultivos.findIndex((viv) => viv.id == Number(data.id.pond));
        if (key in storedCultivos[i]) {
            const sanity = [...storedCultivos[i].sanity, data];
            const checkOut = { ...storedCultivos[i], sanity: sanity };
            storedCultivos[i] = checkOut;
            localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
            localStorage.setItem('history', JSON.stringify(storedCultivos));
        } else {
            const checkOut = { ...storedCultivos[i], sanity: [data] };
            storedCultivos[i] = checkOut;
            localStorage.setItem(`cultivo-${storedCultivos[i].id}`, JSON.stringify(checkOut));
            localStorage.setItem('history', JSON.stringify(storedCultivos));
        }
    }

    return (
        <>
            {showAnalysisPopupPrevious.start && (
                <div className="popup-sanity">
                    <div className="popup-inner-sanity">
                        <h3>Análise Presuntiva</h3>
                        <form onSubmit={handleStartSample} className="harv-form">
                            {/* <label>
                                <span>Fazenda:</span>
                                <input
                                    type="text"
                                    name="origin"
                                    value={analysisId.origin}
                                    onChange={(e) => setAnalysisId({ ...analysisId, origin: e.target.value })}
                                    required
                                />
                            </label> */}
                            <label>
                                <span>Viveiro:</span>
                                <select
                                    name="pond"
                                    value={analysisId.pond}
                                    onChange={(e) => setAnalysisId({ ...analysisId, pond: e.target.value })}
                                    required>
                                    <option value="">Selecione o viveiro</option>
                                    {storedPonds.length > 0 ? (
                                        storedPonds.map((pond, index) => (
                                            <option value={pond.id} key={index}>{pond.viveiro}</option>
                                        ))
                                    ) : (<option value="">Nenhum cultivo cadastrado</option>)}
                                </select>

                                {/* <input
                                    type="text"
                                    name="pond"
                                    value={analysisId.pond}
                                    onChange={(e) => setAnalysisId({ ...analysisId, pond: e.target.value })}
                                    required
                                /> */}
                            </label>
                            <label>
                                <span>Data:</span>
                                <input
                                    type="date"
                                    name="date"
                                    value={analysisId.date}
                                    onChange={(e) => setAnalysisId({ ...analysisId, date: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                <span style={{ textAlign: 'left' }}>Camarões grampados?</span>
                                <select
                                    name="shrimpsPinned"
                                    value={analysisId.shrimpsPinned}
                                    onChange={(e) => setAnalysisId({ ...analysisId, shrimpsPinned: e.target.value })}
                                >
                                    <option value={true}>Sim</option>
                                    <option value={false}>Não</option>
                                </select>
                            </label>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => (setShowAnalysisPopupPrevious({ start: false, previous: true }))}>
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="first-class-button">
                                    Lançar observações</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showForm && (
                <div className="popup-sanity">
                    <div className="popup-inner-sanity">
                        <h3 className="sanity-title">Análise Presuntiva</h3>
                        <div className="fade-out-sup" />
                        <div className="main-content">
                            <div className="main-content-start" />
                            <form onSubmit={handleAnalysisSubmit} >
                                <div className="form-content">
                                    <label>
                                        Peso:
                                        <input
                                            type="number"
                                            name="peso"
                                            value={formAnalysis.peso}
                                            onChange={handleAnalysisChange}
                                            required
                                        />
                                    </label>
                                    <h3>Conformação Externa</h3>
                                    <label>
                                        Antenas:
                                        <div className="button-container-classes">
                                            {["Normais", "Quebradiças", "Rugosas"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.conformacaoAntenas === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'conformacaoAntenas', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        <br />
                                        Urópodos:
                                        <div className="button-container-classes">
                                            {["Normais", "Luminescentes", "Avermelhados"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.uropodos === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'uropodos', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        <br />
                                        Presença de Necroses Indicativas de IMNV:
                                        <div className="button-container-classes">
                                            {["Sim", "Não"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.necrosesIMNV === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'necrosesIMNV', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <p>________________</p>
                                    <label>
                                        <h3>Tempo de Coagulação da Hemolinfa:</h3>
                                        <input
                                            type="number"
                                            name="tempoCoagulacao"
                                            value={formAnalysis.tempoCoagulacao}
                                            onChange={handleAnalysisChange}
                                            required
                                        />
                                    </label>
                                    <p>________________</p>
                                    <br />
                                    <label>
                                        Análise de Cefalotórax:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.analiseCefalotorax === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'analiseCefalotorax', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <p>________________</p>
                                    <br />
                                    <h3>Hepatopâncreas</h3>
                                    <label>
                                        Integridade dos Túbulos:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.integridadeTubulos === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'integridadeTubulos', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        Presença de Lipídeos:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-lipids ${formAnalysis.presencaLipideos === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'presencaLipideos', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <p>________________</p>
                                    <br />
                                    <h3>Trato Digestório</h3>
                                    <label>
                                        Conteúdo:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.conteudoTrato === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'conteudoTrato', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        Repleção:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.replecaoTrato === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'replecaoTrato', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <p>________________</p>
                                    <br />
                                    <h3>Presença de Epicomensais</h3>
                                    <label>
                                        Brânquias:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.branquiasEpicomensais === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'branquiasEpicomensais', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        Epipodito:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.epipoditoEpicomensais === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'epipoditoEpicomensais', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <p>________________</p>
                                    <br />
                                    <h3>Necroses</h3>
                                    <label>
                                        IMNV:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.necroseIMNV === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'necroseIMNV', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        Blackspot:
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.necroseBlackspot === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'necroseBlackspot', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                </div>
                                <span>

                                    <button type="submit" className="add-shrimp">+</button>

                                </span>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <div className="bottom-buttons">
                                    <button
                                        type="button"
                                        onClick={() => (
                                            setShowForm(false),
                                            setShowAnalysisPopupPrevious({ start: true, previous: false }))}
                                        className="cancel-button">
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => logoutSanity()}
                                        className="first-class-button">
                                        Finalizar
                                    </button>

                                </div>
                            </form>
                            {/* <div className="main-content-bottom" /> */}
                        </div>

                    </div>
                </div>
            )}
            {checkScreen && (
                <div className="popup">
                    <div className="popup-inner-check">
                        <FontAwesomeIcon icon={faCheck} size="4x" />
                    </div>
                </div>
            )}
        </>
    );
};

export default SanityAnalysis;
