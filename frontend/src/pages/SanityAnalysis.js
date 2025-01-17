import React, { useState, useEffect } from 'react';
import '../styles/SanityAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import * as images from '../assets/images';

const SanityAnalysis = ({ setShowAnalysisPopup, showAnalysisPopupPrevious, setShowAnalysisPopupPrevious }) => {
    const [showForm, setShowForm] = useState(false);
    const [checkScreen, setCheckScreen] = useState(false);
    const [storedPonds, setStoredPonds] = useState({});
    const [saveString, setSaveString] = useState('');
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
        conteudoTratoMedio: '',
        replecaoTrato: '',
        branquiasEpicomensais: '',
        epipoditoEpicomensais: '',
        necroseIMNV: '',
        necroseBlackspot: '',
        obsDeformidades: 'Não',
        obsDeformidadesDetalhe: ''
    });

    const [showZoomPopup, setShowZoomPopup] = useState(false);
    const [zoomImageSrc, setZoomImageSrc] = useState('');

    const openZoomPopup = (imageSrc, str) => {
        setZoomImageSrc(imageSrc);
        setShowZoomPopup(true);
        setSaveString(str);
    };

    const closeZoomPopup = () => {
        setShowZoomPopup(false);
        setShowImages({ ...showImages, [saveString]: true });
        setSaveString('');
    };

    const [showImages, setShowImages] = useState({
        analiseCefalotorax: false,
        integridadeTubulos: false,
        presencaLipideos: false,
        necrosesIMNV: false,
    });

    const toggleImages = (key) => {
        setShowImages(prevState => {
            const newState = {
                ...prevState,
                [key]: !prevState[key]
            };

            if (newState[key] === false) {
                setTimeout(() => {
                    const nextElement = document.querySelector(`[name="${key}"]`);
                    if (nextElement) {
                        nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 500);
            }

            return newState;
        });
    };

    const handleImageClick = (num, obs) => {
        handleAnalysisChangeClick(null, obs, num.toString());
    };

    const handleAnalysisChange = (e) => {
        const { name, value } = e.target;
        // setFormAnalysis({ ...formAnalysis, [name]: value });
        setFormAnalysis(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAnalysisChangeClick = (e, obs, value) => {
        e && e.preventDefault();
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
            tempoCoagulacao: '',
            analiseCefalotorax: '',
            integridadeTubulos: '',
            presencaLipideos: '',
            conteudoTrato: '',
            conteudoTratoMedio: '',
            replecaoTrato: '',
            branquiasEpicomensais: '',
            epipoditoEpicomensais: '',
            necroseIMNV: '',
            necroseBlackspot: '',
            obsDeformidades: '',
            obsDeformidadesDetalhe: ''
        });
        setCheckScreen(true);
        setShowForm(false);
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
    }, [checkScreen, onClose]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('history')).filter(pond => pond.hasShrimp) || {};
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
    };

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
            {/* https://www.facebook.com/fcaaquicultura?locale=pt_BR - vídeo de preparação de lâminas */}
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
                        <div className="main-content">
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
                                        <div className="observacoes-container">
                                            <p>Deformidades?</p>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        id="observacaoSim"
                                                        name="obsDeformidades"
                                                        value="Sim"
                                                        checked={formAnalysis.obsDeformidades === 'Sim'}
                                                        onChange={(e) => handleAnalysisChange(e)}
                                                    />
                                                    <span>Sim</span></label>
                                            </div>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        id="observacaoNao"
                                                        name="obsDeformidades"
                                                        value="Não"
                                                        checked={formAnalysis.obsDeformidades === 'Não'}
                                                        onChange={(e) => handleAnalysisChange(e)}
                                                    />
                                                    <span>Não</span></label>
                                            </div>
                                            {formAnalysis.obsDeformidades === 'Sim' && (
                                                <div className="input-container">
                                                    <label htmlFor="observacaoDetalhe">Qual:
                                                        <input
                                                            type="text"
                                                            id="observacaoDetalhe"
                                                            name="obsDeformidadesDetalhe"
                                                            value={formAnalysis.obsDeformidadesDetalhe || ''}
                                                            onChange={(e) => handleAnalysisChange(e)}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    {/* <span>Pigmentação</span> */}

                                    <label>
                                        Pigmentação
                                        <br /><br />
                                    </label>
                                    
                                    <label>
                                        Pleópodos
                                        <br /><br />
                                    </label>

                                    <label>
                                        Antenas:
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('conformacaoAntenas') }}>
                                            <FontAwesomeIcon icon={showImages.conformacaoAntenas ? faChevronUp : faChevronDown} />
                                            {showImages.conformacaoAntenas && (
                                                <div className="images-container">
                                                    <div className="image-wrapper" key="an01">
                                                        <img
                                                            src={images["an01"]}
                                                            alt="Conformação das Antenas"
                                                            onClick={(e) => { e.preventDefault(); handleImageClick("an01", 'conformacaoAntenas') }}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faSearchPlus}
                                                            className="zoom-icon"
                                                            onClick={(e) => { e.preventDefault(); openZoomPopup(images["an01"], 'conformacaoAntenas') }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container-classes">
                                            {["Normais", "Quebradiças", "Rugosas"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.conformacaoAntenas === num.toString() ? 'selected' : ''}`}
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
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('uropodos') }}>
                                            <FontAwesomeIcon icon={showImages.uropodos ? faChevronUp : faChevronDown} />
                                            {showImages.uropodos && (
                                                <div className="images-container">
                                                    {["ur01", "ur02"].map((imgKey) => (
                                                        <div className="image-wrapper" key={imgKey}>
                                                            <img
                                                                src={images[imgKey]}
                                                                alt={`Urópodos ${imgKey}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(imgKey, 'uropodos') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[imgKey], 'uropodos') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container-classes">
                                            {["Normais", "Luminescentes", "Avermelhados"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.uropodos === num ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'uropodos', num)}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>


                                    <label>
                                        <br />
                                        Presença de Necroses Indicativas de IMNV:
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('necrosesIMNV') }}>
                                            <FontAwesomeIcon icon={showImages.necrosesIMNV ? faChevronUp : faChevronDown} />
                                            {showImages.necrosesIMNV && (
                                                <div className="images-container">
                                                    <div className="image-wrapper" key="imnv01">
                                                        <img
                                                            src={images['imnv01']}
                                                            alt="necroses indicativas de IMNV"
                                                            onClick={(e) => { e.preventDefault(); handleImageClick('imnv01', 'necrosesIMNV') }}
                                                            style={{ cursor: 'pointer' }}
                                                        // https://gia.org.br/portal/doencas-que-afetam-camaroes-marinhos-e-sao-de-notificacao-obrigatoria/
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faSearchPlus}
                                                            className="zoom-icon"
                                                            onClick={(e) => { e.preventDefault(); openZoomPopup(images['imnv01'], 'necrosesIMNV') }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container-classes">
                                            {["Sim", "Não"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.necrosesIMNV === num ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'necrosesIMNV', num)}
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

                                    <label name="analiseCefalotorax">
                                        Análise de Cefalotórax
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('analiseCefalotorax') }}>
                                            <FontAwesomeIcon icon={showImages.analiseCefalotorax ? faChevronUp : faChevronDown} />
                                            {showImages.analiseCefalotorax && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                key={num}
                                                                src={images[`ws0${num}`]}
                                                                alt={`carapaça com depósitos de cálcio em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'analiseCefalotorax') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`ws0${num}`], 'analiseCefalotorax') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.analiseCefalotorax === num.toString() ? 'selected' : ''}`}
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
                                    <label name="integridadeTubulos">
                                        Integridade dos Túbulos
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('integridadeTubulos') }}>
                                            <FontAwesomeIcon icon={showImages.integridadeTubulos ? faChevronUp : faChevronDown} />
                                            {showImages.integridadeTubulos && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`hp0${num}`]}
                                                                alt={`integridade dos túbulos em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'integridadeTubulos') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`hp0${num}`], 'integridadeTubulos') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.integridadeTubulos === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'integridadeTubulos', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label name="presencaLipideos">
                                        Presença de Lipídeos
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('presencaLipideos') }}>
                                            <FontAwesomeIcon icon={showImages.presencaLipideos ? faChevronUp : faChevronDown} />
                                            {showImages.presencaLipideos && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`lp0${num}`]}
                                                                alt={`presença de lipídeos em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'presencaLipideos') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`lp0${num}`], 'presencaLipideos') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-lipids ${formAnalysis.presencaLipideos === num.toString() ? 'selected' : ''}`}
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

                                    <label name="conteudoTratoMedio">
                                        Conteúdo do Trato - Intestino Médio
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('conteudoTratoMedio') }}>
                                            <FontAwesomeIcon icon={showImages.conteudoTratoMedio ? faChevronUp : faChevronDown} />
                                            {showImages.conteudoTratoMedio && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`im0${num}`]}
                                                                alt={`conteúdo do trato em grau 0${num}`}
                                                                // onClick={(e) => { e.preventDefault(); handleImageClick(num, 'conteudoTratoMedio') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`im0${num}`], 'conteudoTratoMedio') }}
                                                            />
                                                        </div>
                                                    ))}
                                                    <p>Observar:</p>
                                                    <ul className="points-list">
                                                        <li>Presença de ração consumida</li>
                                                        <li>Presença de alimento natural consumido</li>
                                                        <li>Presença de detritos</li>
                                                        <li>Presença de alimento não digerido</li>
                                                        <li>Presença de necrofagia</li>
                                                        <li>Presença Cianobactérias (Synecocystis; Microcystis; Oscilatório; etc.)</li>
                                                        <li>Sintomas de Enterite Hemocítica (HE)</li>
                                                        <li>Presença de grãos de areia</li>
                                                        <li>Presença de Gregarinas</li>
                                                        <li>Presença de Nematódeos</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.conteudoTratoMedio === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'conteudoTratoMedio', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label name="conteudoTrato">
                                        Conteúdo do Trato - Intestino Posterior
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('conteudoTrato') }}>
                                            <FontAwesomeIcon icon={showImages.conteudoTrato ? faChevronUp : faChevronDown} />
                                            {showImages.conteudoTrato && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`ip0${num}`]}
                                                                alt={`conteúdo do trato em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'conteudoTrato') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`ip0${num}`], 'conteudoTrato') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.conteudoTrato === num.toString() ? 'selected' : ''}`}
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
                                                    className={`analysis-button-lipids ${formAnalysis.replecaoTrato === num.toString() ? 'selected' : ''
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
                                    {/* <h3>Observações</h3> */}


                                </div>
                                <span>
                                    <button type="submit" className="add-shrimp">+</button>
                                </span>
                                <br />
                                <div className="box-buttons">

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
                        </div>

                    </div >
                </div >
            )}
            {
                showZoomPopup && (
                    <div className="zoom-popup">
                        <div className="zoom-popup-inner">
                            <button className="close-zoom-popup" onClick={closeZoomPopup}>×</button>
                            <img src={zoomImageSrc} alt="Zoomed view" className="zoom-image" />
                        </div>
                    </div>
                )
            }
            {
                checkScreen && (
                    <div className="popup">
                        <div className="popup-inner-check">
                            <FontAwesomeIcon icon={faCheck} size="4x" />
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default SanityAnalysis;
