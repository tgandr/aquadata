import React, {useState} from 'react';

const SanityAnalysis = ({setShowAnalysisPopup}) => {
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

    const handleAnalysisSubmit = (e) => {
        e.preventDefault();
        console.log(formAnalysis);
        setShowAnalysisPopup(false);
      };
    
      return (
        <div className="popup">
            <div className="popup-inner">
            <h3>Análise Presuntiva</h3>
            <form onSubmit={handleAnalysisSubmit}>
                <label>
                Data:
                <input
                    type="date"
                    name="data"
                    value={formAnalysis.data}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <label>
                Quantidade de Animais Analisados:
                <input
                    type="number"
                    name="quantidadeAnimais"
                    value={formAnalysis.quantidadeAnimais}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <label>
                Peso Médio:
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
                <select name="conformacaoAntenas" value={formAnalysis.conformacaoAntenas} onChange={handleAnalysisChange}>
                    <option value="">Selecione</option>
                    <option value="normais">Normais</option>
                    <option value="quebradiças">Quebradiças</option>
                    <option value="rugosas">Rugosas</option>
                </select>
                </label>
                <label>
                Urópodos:
                <select name="uropodos" value={formAnalysis.uropodos} onChange={handleAnalysisChange}>
                    <option value="">Selecione</option>
                    <option value="normais">Normais</option>
                    <option value="luminescentes">Luminescentes</option>
                    <option value="avermelhados">Avermelhados</option>
                </select>
                </label>
                <label>
                Presença de Necroses Indicativas de IMNV:
                <select name="necrosesIMNV" value={formAnalysis.necrosesIMNV} onChange={handleAnalysisChange}>
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="não">Não</option>
                </select>
                </label>
                <label>
                Camarões Grampados:
                <select name="camaroesGrampados" value={formAnalysis.camaroesGrampados} onChange={handleAnalysisChange}>
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="não">Não</option>
                </select>
                </label>
                <label>
                Tempo de Coagulação da Hemolinfa:
                <input
                    type="number"
                    name="tempoCoagulacao"
                    value={formAnalysis.tempoCoagulacao}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <label>
                Análise de Cefalotórax:
                <input
                    type="number"
                    name="analiseCefalotorax"
                    value={formAnalysis.analiseCefalotorax}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <h3>Hepatopâncreas</h3>
                <label>
                Integridade dos Túbulos:
                <input
                    type="number"
                    name="integridadeTubulos"
                    value={formAnalysis.integridadeTubulos}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <label>
                Presença de Lipídeos:
                <input
                    type="number"
                    name="presencaLipideos"
                    value={formAnalysis.presencaLipideos}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <h3>Trato Digestório</h3>
                <label>
                Conteúdo:
                <input
                    type="number"
                    name="conteudoTrato"
                    value={formAnalysis.conteudoTrato}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <label>
                Repleação:
                <input
                    type="number"
                    name="replecaoTrato"
                    value={formAnalysis.replecaoTrato}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <h3>Presença de Epicomensais</h3>
                <label>
                Brânquias:
                <input
                    type="number"
                    name="branquiasEpicomensais"
                    value={formAnalysis.branquiasEpicomensais}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <label>
                Epipodito:
                <input
                    type="number"
                    name="epipoditoEpicomensais"
                    value={formAnalysis.epipoditoEpicomensais}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <h3>Necrose</h3>
                <label>
                IMNV:
                <input
                    type="number"
                    name="necroseIMNV"
                    value={formAnalysis.necroseIMNV}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <label>
                Blackspot:
                <input
                    type="number"
                    name="necroseBlackspot"
                    value={formAnalysis.necroseBlackspot}
                    onChange={handleAnalysisChange}
                    required
                />
                </label>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowAnalysisPopup(false)}>Cancelar</button>
            </form>
            </div>
        </div>       
      )
}

export default SanityAnalysis;