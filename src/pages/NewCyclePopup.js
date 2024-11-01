import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CountingPls from './CountingPls';

const NewCyclePopup = ({
    showNewCyclePopup, setShowNewCyclePopup,
    showStressTestPopup, setShowStressTestPopup,
    form, setForm,
    viveiroId,
    setCultivo
}) => {
    const [showCountPlPopup, setShowCountPlPopup] = useState(false);

    const [testForm, setTestForm] = useState({
        tipoTeste: '',
        alteracaoNatatoria: '',
        larvasMortas: ''
    });
    const [postLarvae, setPostLarvae] = useState([
        "Aquacrusta", "Aquatec", "CELM", "Larvifort"]);
    const [addNewPostLarvae, setAddNewPostLarvae] = useState(false);
    const [customPostLarvae, setCustomPostLarvae] = useState('');
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [showMetas, setShowMetas] = useState(false);
    const [showParameters, setShowParameters] = useState(false);
    const [metas, setMetas] = useState({
        sobrevivencia: "",
        tempo: "",
        tamanho: ""
    })
    const [area, setArea] = useState(0);
    const [formParam, setFormParam] = useState({
        check: '',
        details: '',
        oxygen: { transp: '', pond: '' },
        temperature: { transp: '', pond: '' },
        ph: { transp: '', pond: '' },
        salinity: { transp: '', pond: '' },
        ammonium: { transp: '', pond: '' },
        nitrite: { transp: '', pond: '' }
    });

    const savePostLarvaeList = (l) => {
        if (l !== '') {
            setPostLarvae([...postLarvae, l]);
            setCustomPostLarvae('');
            let stockData = JSON.parse(localStorage.getItem('stockData')) || {};
            if ('postLarvaeList' in stockData) {
                stockData.postLarvaeList.push(l);
            } else {
                stockData.postLarvaeList = [...postLarvae, l];
            }
            localStorage.setItem('stockData', JSON.stringify(stockData));
        }
        // setFormPostLarvae({ ...formPostLarvae, fornecedor: larvae });
        setAddNewPostLarvae(false);
        // setShowPopup({ ...showPopup, postLarvae: true });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    };

    const handleStressTestClick = (value) => {
        setForm({ ...form, testeEstresse: value });
    };

    // const videoConstraints = {
    //     facingMode: { exact: "environment" }
    // }

    // const [showAdjustCount, setShowAdjustCount] = useState({
    //     show: false,
    //     buttonText: 'Ajustar contagem'
    // });

    const [countPLbyPhoto, setCountPLbyPhoto] = useState({
        showPopupCountPL: false,
        weight: '',
        amount: ''
    });

    const handleCountPLbyPhoto = (value) => {
        setCountPLbyPhoto({ ...countPLbyPhoto, showCountPlPopup: value });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    const handleChangeMetas = (e) => {
        const { name, value } = e.target;
        setMetas({ ...metas, [name]: parseInt(value) })
    }

    const handleMetasSubtmit = (e) => {
        e.preventDefault();
        const stressMetasCheckOut = { ...form, metas };
        setShowMetas(false);
        setForm(stressMetasCheckOut);
    }

    const handleChangeStressTest = (e) => {
        const { name, value } = e.target;
        setTestForm({ ...testForm, [name]: value });
    }

    const handleStressTestSubtmit = (e) => {
        e.preventDefault();
        const stressTestCheckOut = { ...form, testForm };
        setShowStressTestPopup(false);
        setForm(stressTestCheckOut);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const viveiros = JSON.parse(localStorage.getItem('viveiros'));
        const vivNumber = viveiros.find(viv => viv.id === viveiroId);
        let history = JSON.parse(localStorage.getItem('history'));
        let newCultivo = {};
        const id = uuidv4();
        let cultivoKey = id;
        const quantEstoc = form.quantidadeEstocada * 1000;
        const setFormToSubmit = { ...form, quantidadeEstocada: quantEstoc, formParam };
        if (history) {
            newCultivo = {
                ...setFormToSubmit,
                dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0],
                viveiro: parseInt(vivNumber.nome.match(/\d+/)[0]),
                viveiroId,
                id,
                hasShrimp: true
            };
            history = [...history, newCultivo];
        } else {
            newCultivo = {
                ...setFormToSubmit,
                dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0],
                viveiro: parseInt(vivNumber.nome.match(/\d+/)[0]),
                viveiroId,
                id,
                hasShrimp: true
            };
            history = [newCultivo];
        }
        localStorage.setItem('history', JSON.stringify(history));
        localStorage.setItem(`cultivo-${cultivoKey}`, JSON.stringify(newCultivo));
        setCultivo(newCultivo);
        setShowNewCyclePopup(false);
    };

    const handleSavePLcount = () => {
        console.log('terminar')
    };

    const handleParametersChange = (e, param, type) => {
        const check = e.target.name;
        const { value } = e.target;

        if (type === "transp" || type === "pond") {
            setFormParam(prevState => ({
                ...prevState,
                [param]: {
                    ...prevState[param],
                    [type]: value
                }
            }));
        } else {
            setFormParam({ ...formParam, [check]: e.target.value })
        }
    }

    const handleParametersChangeSubmit = (e) => {
        console.log(e.target)
        e.preventDefault();
        setShowParameters(false);
    }

    useEffect(() => {
        const pondArea = JSON.parse(localStorage.getItem("viveiros")).find(p => p.id === viveiroId);
        console.log(pondArea)
        setArea(pondArea.area);
        if (form.origemPL === 'custom') {
            setAddNewPostLarvae(true);
        } else {
            setAddNewPostLarvae(false);
        }
    }, [form.origemPL]);

    useEffect(() => {
        const checkLists = JSON.parse(localStorage.getItem('stockData')) || {};
        // const checkPurchases = JSON.parse(localStorage.getItem('financial')) || {};
        // setPurchases(checkPurchases);
        if ('postLarvaeList' in checkLists) {
            setPostLarvae(checkLists.postLarvaeList);
        }
    }, []);

    return (
        <>
            {showNewCyclePopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Novo Ciclo de Cultivo</h3>
                        <form onSubmit={handleSubmit} className="harv-form">
                            <label>
                                Data de Povoamento:
                                <input
                                    type="date"
                                    name="dataPovoamento"
                                    value={form.dataPovoamento}
                                    onChange={handleChange}
                                    required />
                            </label>
                            <label>
                                Origem da PL:
                                <select
                                    name="origemPL"
                                    value={form.origemPL}
                                    onChange={handleChange}
                                    required>
                                    <option value="">Selecione</option>
                                    {postLarvae.map((pl, index) => (
                                        <option value={pl} key={index}>{pl}</option>
                                    ))}
                                    <option value="custom">Outro - Informar</option>
                                </select>
                            </label>
                            <label>
                                Uniformidade:
                                <select
                                    // terminar programação
                                    name="uniformidade"
                                    // value={}
                                    onChange={handleChange}
                                    required>
                                    <option value="">Selecione</option>
                                    <option value="excelente">Excelente</option>
                                    <option value="boa">Boa</option>
                                    <option value="aceitavel">Aceitável</option>
                                    <option value="desuniforme">Desuniforme</option>

                                </select>
                            </label>
                            <label>
                                Quantidade Estocada em Milheiros:
                                <input
                                    type="number"
                                    name="quantidadeEstocada"
                                    // value={form.quantidadeEstocada ? Number(form.quantidadeEstocada).toLocaleString('pt-BR') : ''}
                                    value={form.quantidadeEstocada}
                                    onChange={handleChange}
                                    required />
                            </label>
                            <span className="pls">{(form.quantidadeEstocada * 1000).toLocaleString('pt-BR')}&nbsp;
                                pós-larvas</span>
                            <span className="pls">{(form.quantidadeEstocada * 1000 / area / 10000).toLocaleString('pt-BR')}&nbsp;
                                PLs/m²</span>
                            <label>
                                Teste de Estresse:
                                <div className="stress-test-buttons">
                                    <button
                                        type="button"
                                        className="check-Pl-button"
                                        // className={`stress-test-button ${form.testeEstresse === 'Sim' ? 'active' : ''}`}
                                        onClick={() => setShowStressTestPopup(true)}>
                                        Anotar
                                    </button>
                                </div>
                            </label>
                            <label>
                                Calcular PL/grama por foto?
                                <div className="stress-test-buttons">
                                    <button
                                        type="button"
                                        className="check-Pl-button"
                                        // className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Sim' ? 'active' : ''}`}
                                        onClick={() => (handleCountPLbyPhoto('Sim'), setShowCountPlPopup(true))}>
                                        Contar
                                    </button>
                                    {/* <button
                                        type="button"
                                        // className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Não' ? 'active' : ''}`}
                                        onClick={() => handleCountPLbyPhoto('Não')}
                                    >
                                        Não
                                    </button> */}
                                </div>
                            </label>
                            <label>
                                Qualidade da água de transporte e recebimento:
                                <div className="stress-test-buttons">
                                    <button
                                        type="button"
                                        className="check-Pl-button"
                                        onClick={() => setShowParameters(true)}>
                                        Anotar
                                    </button>
                                </div>
                            </label>
                            <label>
                                Deseja registrar uma meta?
                                <div className="stress-test-buttons">
                                    <button
                                        type="button"
                                        className="check-Pl-button"
                                        onClick={() => setShowMetas(true)}>
                                        Metas
                                    </button>
                                </div>
                            </label>
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => setShowNewCyclePopup(false)}
                                    className="cancel-button">
                                    Cancelar
                                </button>
                                <button type="submit" className="first-class-button">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showStressTestPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Teste de Estresse</h3>
                        <form className="harv-form" onSubmit={handleStressTestSubtmit}>
                            <label>
                                Tipo de Teste:
                                <select name="tipoTeste" value={testForm.tipoTeste} onChange={handleChangeStressTest} required>
                                    <option value="">Selecione</option>
                                    <option value="alteracaoSalinidade">Testado com alteração de salinidade</option>
                                    <option value="aguaViveiro">Testado com água do viveiro</option>
                                </select>
                            </label>
                            <label>
                                Alteração da Resposta Natatória:
                                <select name="alteracaoNatatoria" value={testForm.alteracaoNatatoria} onChange={handleChangeStressTest} required>
                                    <option value="">Selecione</option>
                                    <option value="nenhuma">Nenhuma alteração</option>
                                    <option value="pequena">Pequena alteração</option>
                                    <option value="media">Média alteração</option>
                                    <option value="grande">Grande alteração</option>
                                </select>
                            </label>
                            <label>
                                Larvas Mortas:
                                <select name="larvasMortas" value={testForm.larvasMortas} onChange={handleChangeStressTest} required>
                                    <option value="">Selecione</option>
                                    <option value="nenhuma">Nenhuma</option>
                                    <option value="poucas">Poucas</option>
                                    <option value="muitas">Muitas</option>
                                </select>
                            </label>
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => { setShowStressTestPopup(false); setShowNewCyclePopup(true); }}
                                    className="cancel-button">Cancelar</button>
                                <button
                                    type="submit"
                                    onClick={() => handleStressTestClick('Sim')}
                                    className="first-class-button">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showMetas && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Metas</h3>
                        <form className="harv-form" onSubmit={handleMetasSubtmit}>
                            <label>
                                <p>Tempo de cultivo <br />- em dias</p>
                                <input
                                    type="number"
                                    name="tempo"
                                    // value={form.quantidadeEstocada}
                                    onChange={handleChangeMetas}
                                    required />
                            </label>
                            <label>
                                Tamanho médio <br />- em gramas
                                <input
                                    type="number"
                                    name="tamanho"
                                    // value={form.quantidadeEstocada}
                                    onChange={handleChangeMetas}
                                    required />
                            </label>
                            <label>
                                Sobrevivência <br />- em porcentagem
                                <input
                                    type="number"
                                    name="sobrevivencia"
                                    // value={form.quantidadeEstocada}
                                    onChange={handleChangeMetas}
                                    required />
                            </label>
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => { setShowMetas(false); setShowNewCyclePopup(true); }}
                                    className="cancel-button">Cancelar</button>
                                <button
                                    type="submit"
                                    className="first-class-button">Salvar</button>
                            </div>
                        </form>
                        <br />
                        <br />
                    </div>
                </div>
            )}

            {showParameters && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Checagem de parâmetros de qualidade da água e aclimatação</h3>
                        <form className="harv-form"
                            onSubmit={handleParametersChangeSubmit}
                        >
                            <label>
                                Foi realizada checagem?
                                <select name="check"
                                    value={formParam.check}
                                    onChange={handleParametersChange} required>
                                    <option value="">Selecione</option>
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </select>
                            </label>
                            <label>
                                Deseja detalhar a checagem?
                                <select name="details"
                                    value={formParam.details}
                                    onChange={handleParametersChange} required>
                                    
                                    {(formParam.check === "true" || formParam.check === "") && (
                                        <option value="">Selecione</option>
                                    )}

                                    {formParam.check === "true" && (
                                        <>
                                            <option value="true">Sim</option>
                                            <option value="false">Não</option>
                                        </>
                                    )}

                                    {formParam.check === "false" && (
                                        <option value="false">Não</option>
                                    )}

                                </select>
                            </label>
                            {formParam.details === "true" && (
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Parâmetro</th>
                                                <th>Transporte</th>
                                                <th>Viveiro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Oxigênio</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.oxygen.transp}
                                                        onChange={(e) => handleParametersChange(e, 'oxygen', 'transp')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.oxygen.pond}
                                                        onChange={(e) => handleParametersChange(e, 'oxygen', 'pond')}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Temperatura</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.temperature.transp}
                                                        onChange={(e) => handleParametersChange(e, 'temperature', 'transp')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.temperature.pond}
                                                        onChange={(e) => handleParametersChange(e, 'temperature', 'pond')}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>pH</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.ph.transp}
                                                        onChange={(e) => handleParametersChange(e, 'ph', 'transp')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.ph.pond}
                                                        onChange={(e) => handleParametersChange(e, 'ph', 'pond')}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Salinidade</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.salinity.transp}
                                                        onChange={(e) => handleParametersChange(e, 'salinity', 'transp')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.salinity.pond}
                                                        onChange={(e) => handleParametersChange(e, 'salinity', 'pond')}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Amônia</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.ammonium.transp}
                                                        onChange={(e) => handleParametersChange(e, 'ammonium', 'transp')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.ammonium.pond}
                                                        onChange={(e) => handleParametersChange(e, 'ammonium', 'pond')}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Nitrito</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.nitrite.transp}
                                                        onChange={(e) => handleParametersChange(e, 'nitrite', 'transp')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={formParam.nitrite.pond}
                                                        onChange={(e) => handleParametersChange(e, 'nitrite', 'pond')}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            )

                            }
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    onClick={() => setShowParameters(false)}
                                    className="cancel-button">Cancelar</button>
                                <button
                                    type="submit"
                                    onClick={() => handleStressTestClick('Sim')}
                                    className="first-class-button">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCountPlPopup && (<CountingPls
                setShowNewCyclePopup={setShowNewCyclePopup}
                handleSavePLcount={handleSavePLcount}
                showCountPlPopup={showCountPlPopup}
                setShowCountPlPopup={setShowCountPlPopup} />)}

            {addNewPostLarvae && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Informar novo fornecedor de pós-larvas</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                savePostLarvaeList(customPostLarvae);
                            }}
                            className="harv-form">
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    name="fertilizer"
                                    value={customPostLarvae}
                                    onChange={(e) => setCustomPostLarvae(e.target.value)}
                                    required />
                            </label>
                            <br />
                            <br />
                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    // onClick={() => (setAddNewPostLarvae(false), setShowPopup({ ...showPopup, postLarvae: true }))}
                                    onClick={() => (setAddNewPostLarvae(false))}
                                    className="cancel-button">
                                    Voltar</button>
                                <button type="submit"
                                    className="first-class-button">
                                    Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showSavedMessage && <div className="saved-message">Salvo!</div>}
        </>
    )
}

export default NewCyclePopup;