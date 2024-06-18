import React, { useState, useRef } from 'react';
import '../styles/SanityAnalysis.css';

const SanityAnalysis = ({ setShowAnalysisPopup }) => {
    const [formAnalysis, setFormAnalysis] = useState({
        data: new Date().toISOString().split('T')[0],
        quantidadeAnimais: '',
        pesoMedio: '',
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

    const handleAnalysisChange = (e) => {
        const { name, value } = e.target;
        setFormAnalysis({ ...formAnalysis, [name]: value });
    };

    const handleAnalysisChangeClick = (e, obs, value) => {
        e.preventDefault();
        setFormAnalysis({ ...formAnalysis, [obs]: value });
        console.log(obs, value);
    };

    const handleAnalysisSubmit = (e) => {
        e.preventDefault();
        console.log(formAnalysis);
        setShowAnalysisPopup(false);
    };

    return (
        <div className="popup-sanity">
            <div className="popup-inner-sanity">
                <h2 className="sanity-title">Análise Presuntiva</h2>
                <div className="fade-out-sup" />
                <div className="main-content">
                    <div className="main-content-start" />
                    {/* <form onSubmit={handleAnalysisSubmit} > */}
                    <form>
                        <div className="form-content">
                            <label>
                                Peso:
                                <input
                                    type="number"
                                    name="pesoMedio"
                                    value={formAnalysis.pesoMedio}
                                    onChange={handleAnalysisChange}
                                    required
                                />
                            </label>
                            <h3>Conformação Externa</h3>
                            <label>
                                Antenas:
                                <select
                                    name="conformacaoAntenas"
                                    value={formAnalysis.conformacaoAntenas}
                                    onChange={handleAnalysisChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="normais">Normais</option>
                                    <option value="quebradiças">Quebradiças</option>
                                    <option value="rugosas">Rugosas</option>
                                </select>
                            </label>
                            <label>
                                Urópodos:
                                <select
                                    name="uropodos"
                                    value={formAnalysis.uropodos}
                                    onChange={handleAnalysisChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="normais">Normais</option>
                                    <option value="luminescentes">Luminescentes</option>
                                    <option value="avermelhados">Avermelhados</option>
                                </select>
                            </label>
                            <label>
                                Presença de Necroses Indicativas de IMNV:
                                <select
                                    name="necrosesIMNV"
                                    value={formAnalysis.necrosesIMNV}
                                    onChange={handleAnalysisChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="sim">Sim</option>
                                    <option value="não">Não</option>
                                </select>
                            </label>
                            <label>
                                Camarões Grampados:
                                <select
                                    name="camaroesGrampados"
                                    value={formAnalysis.camaroesGrampados}
                                    onChange={handleAnalysisChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="sim">Sim</option>
                                    <option value="não">Não</option>
                                </select>
                            </label>
                            <p>________________</p>
                            <br />
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                Repleação:
                                <div className="button-container">
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <button
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
                        <div className="buttons">
                            <button type="submit">Salvar</button>{' '}
                            <button type="button" onClick={() => setShowAnalysisPopup(false)}>Cancelar</button>
                        </div>
                    </form>
                    <div className="main-content-bottom" />
                </div>
                <div className="fade-out-inf" />
            </div>
        </div>
    );
};

export default SanityAnalysis;
