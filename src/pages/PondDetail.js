import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PondDetail.css';

const PondDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viveiroId = location.state.id;

  const [cultivo, setCultivo] = useState(null);
  const [showPopupNewCycle, setshowPopupNewCycle] = useState(false);
  const [showPopupFeed, setShowPopupFeed] = useState(false);
  const [showParamPopup, setShowParamPopup] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [showBiometry, setShowBiometry] = useState(false);
  
  const [form, setForm] = useState({
    dataPovoamento: '',
    origemPL: '',
    quantidadeEstocada: '',
    testeEstresse: false,
    tipoTeste: '',
    alteracaoNatatoria: '',
    larvasMortas: '',
  });
  const [formFeed, setFormFeed] = useState({
    data: new Date().toISOString().split('T')[0],
    racaoTotalDia: '',
    quantidadeTratos: '',
    observacao1: false,
    observacao2: false,
  });
  const [formParam, setFormParam] = useState({
    data: new Date().toISOString().split('T')[0],
    horario: '',
    temperartura:'',
    oxigenioDissolvido: '',
    ph: '',
    amoniaTotal: '',
  });
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
  const [formBiometry, setFormBiometry] = useState({
    data: new Date().toISOString().split('T')[0], // Pre-filled with current date
    Pesagem: '',
    Contagem: '',
    pesoMedio: null, // To store the calculated average weight
  });

  useEffect(() => {
    const storedCultivo = JSON.parse(localStorage.getItem(`cultivo-${viveiroId}`));
    if (storedCultivo) {
      setCultivo(storedCultivo);
    }
  }, [viveiroId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setFormParam({ ...formParam, [name]: value });
  };

  const handleAnalysisChange = (e) => {
    const { name, value } = e.target;
    setFormAnalysis({ ...formAnalysis, [name]: value });
  };

  const handleBiometrySubmit = (e) => {
    e.preventDefault();
    const { Pesagem, Contagem } = formBiometry;
    if (Pesagem && Contagem) {
      const pesoMedio = Pesagem / Contagem; // Calculate average weight
      setFormBiometry({ ...formBiometry, pesoMedio }); // Update state with calculated average weight
    }
}

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCultivo = {
      ...form,
      dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0],
    };
    localStorage.setItem(`cultivo-${viveiroId}`, JSON.stringify(newCultivo));
    setCultivo(newCultivo);
    setshowPopupNewCycle(false);
  };

  const handleFeedSubmit = (e) => {
    e.preventDefault();
    console.log(formFeed);
    setShowPopupFeed(false);
  };

  const handleParamSubmit = (e) => {
    e.preventDefault();
    console.log(formParam);
    setShowParamPopup(false);
  };

  const handleAnalysisSubmit = (e) => {
    e.preventDefault();
    console.log(formAnalysis);
    setShowAnalysisPopup(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const today = new Date().getTime()
    const dayStart = new Date(dateString).getTime()
    const days = Math.floor((today - dayStart) / 86400000)
    return {
        date: `${day}/${month}/${year}`,
        days: days
    }
  };

  const handleBackClick = () => {
    navigate('/viveiros');
  };

  const handleStressTestClick = (value) => {
    setForm({ ...form, testeEstresse: value });
  };

  return (
    <div className="pond-detail">
      <h2>Detalhes do Viveiro {viveiroId}</h2>
      {cultivo ? (
        <div>
          <h3>Cultivo em Curso</h3>
          <p>Data de Povoamento: {formatDate(cultivo.dataPovoamento).date}</p>
          <p>{formatDate(cultivo.dataPovoamento).days} dias de cultivo</p>
          <p>Origem da PL: {cultivo.origemPL}</p>
          <p>Quantidade Estocada: {cultivo.quantidadeEstocada}</p>
          <p>Teste de Estresse: {cultivo.testeEstresse ? 'Realizado' : 'Não Realizado'}</p>
          <div className="buttons-container">
            <button className="pond-button" onClick={() => setShowPopupFeed(true)}>Anotações de Arraçoamento</button>
            <button className="pond-button" onClick={() => setShowParamPopup(true)}>Parâmetros da Água</button>
            <button className="pond-button" onClick={() => setShowAnalysisPopup(true)}>Análise Presuntiva</button>
            <button className="pond-button" onClick={() => setShowBiometry(true)}>Anotar biometria</button>
            <button className="pond-button">Dados de despesca</button>
            <button className="pond-button">Relatório</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>O viveiro está vazio</h3>
          <button onClick={() => setshowPopupNewCycle(true)}>Novo Ciclo de Cultivo</button>
        </div>
      )}

      {showPopupNewCycle && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Novo Ciclo de Cultivo</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Data de Povoamento:
                <input
                  type="date"
                  name="dataPovoamento"
                  value={form.dataPovoamento}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Origem da PL:
                <input
                  type="text"
                  name="origemPL"
                  value={form.origemPL}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Quantidade Estocada:
                <input
                  type="number"
                  name="quantidadeEstocada"
                  value={form.quantidadeEstocada}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Teste de Estresse:
                <div className="stress-test-buttons">
                  <button
                    type="button"
                    className={`stress-test-button ${form.testeEstresse === 'Sim' ? 'active' : ''}`}
                    onClick={() => handleStressTestClick('Sim')}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    className={`stress-test-button ${form.testeEstresse === 'Não' ? 'active' : ''}`}
                    onClick={() => handleStressTestClick('Não')}
                  >
                    Não
                  </button>
                </div>
              </label>
              {form.testeEstresse === 'Sim' && (
                <div className="stress-test-details">
                  <label>
                    Tipo de Teste:
                    <select name="tipoTeste" value={form.tipoTeste} onChange={handleChange}>
                      <option value="">Selecione</option>
                      <option value="alteracaoSalinidade">Testado com alteração de salinidade</option>
                      <option value="aguaViveiro">Testado com água do viveiro</option>
                    </select>
                  </label>
                  <label>
                    Alteração da Resposta Natatória:
                    <select name="alteracaoNatatoria" value={form.alteracaoNatatoria} onChange={handleChange}>
                      <option value="">Selecione</option>
                      <option value="nenhuma">Nenhuma alteração</option>
                      <option value="pequena">Pequena alteração</option>
                      <option value="media">Média alteração</option>
                      <option value="grande">Grande alteração</option>
                    </select>
                  </label>
                  <label>
                    Larvas Mortas:
                    <select name="larvasMortas" value={form.larvasMortas} onChange={handleChange}>
                      <option value="">Selecione</option>
                      <option value="nenhuma">Nenhuma</option>
                      <option value="poucas">Poucas</option>
                      <option value="muitas">Muitas</option>
                    </select>
                  </label>
                </div>
              )}
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setshowPopupNewCycle(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showPopupFeed && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Anotações de Arraçoamento</h3>
            <form onSubmit={handleFeedSubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={formFeed.data}
                  onChange={(e) => setFormFeed({ ...formFeed, data: e.target.value })}
                  required
                />
              </label>
              <label>
                Ração total do dia:
                <input
                  type="number"
                  name="racaoTotalDia"
                  value={formFeed.racaoTotalDia}
                  onChange={(e) => setFormFeed({ ...formFeed, racaoTotalDia: e.target.value })}
                  required
                />
              </label>
              <label>
                Quantidade de tratos:
                <input
                  type="number"
                  name="quantidadeTratos"
                  value={formFeed.quantidadeTratos}
                  onChange={(e) => setFormFeed({ ...formFeed, quantidadeTratos: e.target.value })}
                  required
                />
              </label>
              <div className='obs'>
                <label>
                  Observações:
                </label>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="observacao1"
                      checked={formFeed.observacao1}
                      onChange={(e) => setFormFeed({ ...formFeed, observacao1: e.target.checked })}
                    />
                    Houve sobras de ração
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="observacao2"
                      checked={formFeed.observacao2}
                      onChange={(e) => setFormFeed({ ...formFeed, observacao2: e.target.checked })}
                    />
                    Reduziu ou suspendeu algum trato
                  </label>
                </div>
              </div>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowPopupFeed(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showParamPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Parâmetros da Água</h3>
            <form onSubmit={handleParamSubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={formParam.data}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                Horário:
                <select name="horario" value={formParam.horario} onChange={handleParamChange}>
                  <option value="">Selecione um horário</option>
                  <option value="6:00">6:00</option>
                  <option value="14:00">14:00</option>
                  <option value="18:00">18:00</option>
                  <option value="22:00">22:00</option>
                </select>
              </label>
              <label>
                Temperatura:
                <input
                  type="number"
                  name="temperatura"
                  value={formParam.temperartura}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                Oxigênio Dissolvido:
                <input
                  type="number"
                  name="oxigenioDissolvido"
                  value={formParam.oxigenioDissolvido}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                pH:
                <input
                  type="number"
                  name="ph"
                  value={formParam.ph}
                  onChange={handleParamChange}
                />
              </label>
              <label>
                Amônia Total:
                <input
                  type="number"
                  name="amoniaTotal"
                  value={formParam.amoniaTotal}
                  onChange={handleParamChange}
                />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowParamPopup(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showAnalysisPopup && (
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
      )}

      {showBiometry && ( // Render biometry popup if showBiometry is true
        <div className="popup">
          <div className="popup-inner">
            <h3>Anotar Biometria</h3>
            <form onSubmit={handleBiometrySubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={formBiometry.data}
                  onChange={(e) => setFormBiometry({ ...formBiometry, data: e.target.value })}
                  required
                />
              </label>
              <label>
                Pesagem (em gramas):
                <input
                  type="number"
                  name="Pesagem"
                  value={formBiometry.Pesagem}
                  onChange={(e) => setFormBiometry({ ...formBiometry, Pesagem: e.target.value })}
                  required
                />
              </label>
              <label>
                Contagem:
                <input
                  type="number"
                  name="Contagem"
                  value={formBiometry.Contagem}
                  onChange={(e) => setFormBiometry({ ...formBiometry, Contagem: e.target.value })}
                  required
                />
              </label>
              <button type="submit">Calcular o peso médio</button>
            </form>
            {formBiometry.pesoMedio && ( // Render average weight if calculated
              <p>Peso Médio: {formBiometry.pesoMedio} g</p>
            )}
            <button type="button" onClick={() => setShowBiometry(false)}>Fechar</button> {/* Close button */}
          </div>
        </div>
      )}

      <button onClick={handleBackClick}>Voltar para Viveiros</button>
    </div>
  );
};

export default PondDetail;
