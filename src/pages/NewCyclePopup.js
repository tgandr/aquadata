import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'react-webcam';

const NewCyclePopup = ({
    showNewCyclePopup, setShowNewCyclePopup,
    showStressTestPopup, setShowStressTestPopup,
    showCountPlPopup, setShowCountPlPopup,
    showCamCountPopup, setShowCamCountPopup,
    showWeightInput, setShowWeightInput,
    showPLgrama, setShowPLgrama,
    darkPoints, setDarkPoints,
    threshold, setThreshold,
    userCount, setUserCount,
    processedImage, setProcessedImage,
    capturedImage, setCapturedImage,
    weight, setWeight,
    showCamera, setShowCamera,
    form, setForm,
    viveiroId,
    setCultivo
}) => {
    const webcamRef = useRef(null);

    const handleStressTestClick = (value) => {
        setForm({ ...form, testeEstresse: value });
    };

    const videoConstraints = {
        facingMode: { exact: "environment" }
    }

    const [showAdjustCount, setShowAdjustCount] = useState({
        show: false,
        buttonText: 'Ajustar contagem'
    });

    const [countPLbyPhoto, setCountPLbyPhoto] = useState({
        showPopupCountPL: false,
        weight: '',
        amount: ''
    });

    const capture = React.useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            countDarkPoints(imageSrc, threshold);
            setCapturedImage(imageSrc);
            setShowCamera(false);
        } else {
            setShowCamera(true);
        }
    }, [webcamRef, threshold]);

    const countDarkPoints = (imageSrc, threshold) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;
            let darkCount = 0;

            const brightnessData = [];
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = (r + g + b) / 3;
                brightnessData.push(brightness < threshold ? 1 : 0);
            }

            const visited = new Array(width * height).fill(false);
            const dfs = (x, y) => {
                const stack = [[x, y]];
                while (stack.length > 0) {
                    const [cx, cy] = stack.pop();
                    const index = cy * width + cx;
                    if (cx >= 0 && cy >= 0 && cx < width && cy < height && !visited[index] && brightnessData[index] === 1) {
                        visited[index] = true;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
                        ctx.fillStyle = 'red';
                        ctx.fill();
                        stack.push([cx + 1, cy]);
                        stack.push([cx - 1, cy]);
                        stack.push([cx, cy + 1]);
                        stack.push([cx, cy - 1]);
                    }
                }
            };

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = y * width + x;
                    if (brightnessData[index] === 1 && !visited[index]) {
                        darkCount++;
                        dfs(x, y);
                    }
                }
            }

            setDarkPoints(darkCount);
            setCountPLbyPhoto({ ...countPLbyPhoto, amount: darkCount })
            setProcessedImage(canvas.toDataURL());
        };
    };

    const handleUserCountChange = (e) => {
        setUserCount(e.target.value);
    };

    const handleWeightChange = (e) => {
        console.log(e.target.value, 'valor do form')
        console.log(countPLbyPhoto.amount, 'contagem da câmera')
        console.log(countPLbyPhoto.weight, 'peso informado no form')
        setCountPLbyPhoto({ ...countPLbyPhoto, weight: e.target.value })
        setWeight(e.target.value)
    }

    const adjustThreshold = () => {
        const realCount = parseInt(userCount, 10);
        if (!isNaN(realCount) && realCount > 0) {
            const difference = darkPoints - realCount;
            const adjustment = difference / 10;
            setThreshold((prevThreshold) => Math.max(prevThreshold - adjustment, 0));
        }
    };

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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const vivNumber = JSON.parse(localStorage.getItem('viveiros'))[viveiroId - 1];
        let history = JSON.parse(localStorage.getItem('history'));
        let newCultivo = {};
        let cultivoKey = 1;
        if (history) {
            newCultivo = {
                ...form,
                dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0],
                viveiro: parseInt(vivNumber.nome.match(/\d+/)[0]),
                viveiroId,
                id: history.length + 1,
                hasShrimp: true
            };
            history = [...history, newCultivo];
            cultivoKey = history.length;
        } else {
            newCultivo = {
                ...form,
                dataPovoamento: new Date(form.dataPovoamento).toISOString().split('T')[0],
                viveiro: parseInt(vivNumber.nome.match(/\d+/)[0]),
                viveiroId,
                id: 1,
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
    }

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
                                        // className={`stress-test-button ${form.testeEstresse === 'Sim' ? 'active' : ''}`}
                                        onClick={() => (handleStressTestClick('Sim'),
                                            setShowStressTestPopup(true))
                                        }
                                    >
                                        Sim
                                    </button>
                                    <button
                                        type="button"
                                        // className={`stress-test-button ${form.testeEstresse === 'Não' ? 'active' : ''}`}
                                        onClick={() => handleStressTestClick('Não')}
                                    >
                                        Não
                                    </button>
                                </div>
                            </label>
                            <label>
                                Calcular PL/grama por foto?:
                                <div className="stress-test-buttons">
                                    <button
                                        type="button"
                                        // className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Sim' ? 'active' : ''}`}
                                        onClick={() => (handleCountPLbyPhoto('Sim'), setShowCountPlPopup(true))}
                                    >
                                        Sim
                                    </button>
                                    <button
                                        type="button"
                                        // className={`stress-test-button ${countPLbyPhoto.showPopupCountPL === 'Não' ? 'active' : ''}`}
                                        onClick={() => handleCountPLbyPhoto('Não')}
                                    >
                                        Não
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
                        <form className="harv-form">
                            <label>
                                Tipo de Teste:
                                <select name="tipoTeste" value={form.tipoTeste} onChange={handleChange} required>
                                    <option value="">Selecione</option>
                                    <option value="alteracaoSalinidade">Testado com alteração de salinidade</option>
                                    <option value="aguaViveiro">Testado com água do viveiro</option>
                                </select>
                            </label>
                            <label>
                                Alteração da Resposta Natatória:
                                <select name="alteracaoNatatoria" value={form.alteracaoNatatoria} onChange={handleChange} required>
                                    <option value="">Selecione</option>
                                    <option value="nenhuma">Nenhuma alteração</option>
                                    <option value="pequena">Pequena alteração</option>
                                    <option value="media">Média alteração</option>
                                    <option value="grande">Grande alteração</option>
                                </select>
                            </label>
                            <label>
                                Larvas Mortas:
                                <select name="larvasMortas" value={form.larvasMortas} onChange={handleChange} required>
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
                                    type="button" 
                                    onClick={() => setShowStressTestPopup(false)}
                                    className="first-class-button">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCountPlPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Calcular PL/grama por foto</h3>
                        <div className="results">
                            {darkPoints ? <span>Contagem: {userCount ? userCount : darkPoints} pós-larvas</span> : <span>Aguardando contagem</span>}
                            {showWeightInput.show ? (<p>Pesagem: {showWeightInput && (
                                <input
                                    type="number"
                                    value={countPLbyPhoto.weight}
                                    onChange={handleWeightChange}
                                />
                            )
                            } gramas</p>) : (
                                <span>
                                    <p>{weight && <span>{weight} gramas</span>} </p>
                                </span>
                            )}
                            {showPLgrama && (
                                userCount ? <span>PL/Grama {weight / userCount}</span> :
                                    <span>PL/Grama {weight / darkPoints}</span>)
                            }
                        </div>
                        <button onClick={() => {
                            setShowCountPlPopup(false);
                            setShowCamera(true);
                            setShowCamCountPopup(true)
                        }}>
                            Foto para contagem
                        </button>
                        <button onClick={() => {
                            if (showWeightInput.buttonText === 'Pesagem') {
                                setShowWeightInput({ show: true, buttonText: 'Calcular PL/grama' });
                            } else {
                                setShowWeightInput({ show: false, buttonText: 'Pesagem' });
                                setShowPLgrama(true);
                            }
                        }}>{showWeightInput.buttonText}</button>
                        <p>Utilize uma bandeja branca e certifique-se que o local é bem iluminado</p>
                        <br />
                        <br />
                        <div className="bottom-buttons">
                        <button type="button" onClick={() => {
                            setShowCountPlPopup(false);
                            setShowNewCyclePopup(true);
                            setShowCamera(false)
                        }}
                        className="cancel-button">
                            Cancelar
                        </button>
                        <button 
                        type="button" 
                        onClick={handleSavePLcount()}
                        className="first-class-button">
                            Salvar</button>
                        </div>
                        
                    </div>
                </div>
            )}

            {showCamCountPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        {showCamera ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={640}
                                height={480}
                                className="webcam"
                                videoConstraints={videoConstraints}
                            />
                        ) : (
                            <div>
                                <img
                                    src={processedImage}
                                    alt="Processed"
                                />
                            </div>
                        )}
                        <p>Quantidade: {userCount ? userCount : darkPoints}</p>
                        {showAdjustCount.show && (
                            <span>
                                <label>
                                    Se a contagem necessita ajuste, indique abaixo a real contagem de PLs
                                    <input
                                        type="number"
                                        value={userCount}
                                        onChange={handleUserCountChange}
                                    />
                                </label>
                            </span>
                        )}
                        <button onClick={capture}>
                            <FontAwesomeIcon icon={faCamera} className="icon" />
                        </button>
                        <button onClick={() => {
                            if (showAdjustCount.buttonText === 'Ajustar contagem') {
                                setShowAdjustCount({ show: true, buttonText: 'Confirmar ajuste' });
                            } else {
                                setShowAdjustCount({ show: false, buttonText: 'Ajustar contagem' });
                                adjustThreshold();
                            }
                        }}>
                            {showAdjustCount.buttonText}</button>
                        <button onClick={() => { setShowCamCountPopup(false); setShowCountPlPopup(true) }}>Voltar</button>
                    </div>
                </ div>
            )}
        </>
    )
}

export default NewCyclePopup;