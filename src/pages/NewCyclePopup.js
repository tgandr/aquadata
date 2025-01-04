import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CountingPls from './CountingPls';
import TransportParameters from './TransportParameters';

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
    const [checkEdit, setCheckEdit] = useState(false);
    const [cult, setCult] = useState({});
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
            setForm({ ...form, origemPL: l });
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
    };

    const handleEditChanges = () => {
        const cultivoCheckOut = { ...cult, ...form, quantidadeEstocada: form.quantidadeEstocada * 1000 }
        const cultivo = 'cultivo-' + cult.id;
        const history = JSON.parse(localStorage.getItem('history'));
        const updateHistory = history.filter((c) => c.id !== cult.id);
        updateHistory.push(cultivoCheckOut);
        localStorage.setItem('history', JSON.stringify(updateHistory));
        localStorage.setItem(cultivo, JSON.stringify(cultivoCheckOut));
        setCultivo(cultivoCheckOut);
        setShowNewCyclePopup(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkEdit) {
            handleEditChanges();
            return
        }
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

    useEffect(() => {
        const pondArea = JSON.parse(localStorage.getItem("viveiros")).find(p => p.id === viveiroId);
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

    useEffect(() => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("cultivo-")) {
                const cultivo = JSON.parse(localStorage.getItem(key));
                if (cultivo.viveiroId === viveiroId) {
                    if (cultivo.hasShrimp) {
                        setForm({
                            ...form,
                            dataPovoamento: cultivo.dataPovoamento,
                            origemPL: cultivo.origemPL,
                            uniformidade: cultivo.uniformidade,
                            quantidadeEstocada: cultivo.quantidadeEstocada / 1000
                        });
                        setCheckEdit(true);
                        setCult(cultivo);
                    }
                }
            }
        }
    }, [])

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
                                    name="uniformidade"
                                    value={form.uniformidade}
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
                            <span className="pls">{(form.quantidadeEstocada * 1000 / area / 10000).toLocaleString('pt-BR', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}&nbsp;
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
                            {/* <label>
                                Calcular PL/grama por foto?
                                <div className="stress-test-buttons">
                                    <button
                                        type="button"
                                        className="check-Pl-button"
                                        // className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Sim' ? 'active' : ''}`}
                                        onClick={() => (handleCountPLbyPhoto('Sim'), setShowCountPlPopup(true))}>
                                        Contar
                                    </button> */}
                            {/* <button
                                        type="button"
                                        // className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Não' ? 'active' : ''}`}
                                        onClick={() => handleCountPLbyPhoto('Não')}
                                    >
                                        Não
                                    </button> */}
                            {/* </div>
                            </label> */}
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

            {showParameters && <TransportParameters
                formParam={formParam}
                setFormParam={setFormParam}
                setShowParameters={setShowParameters} />}

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
                                    name="customPostLarvae"
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