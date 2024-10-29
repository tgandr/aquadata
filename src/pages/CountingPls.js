import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'react-webcam';

const CountingPls = ({ setShowNewCyclePopup, handleSavePLcount,
    showCountPlPopup, setShowCountPlPopup }) => {
    const webcamRef = useRef(null);
    const [showCamCountPopup, setShowCamCountPopup] = useState(false);
    const [showWeightInput, setShowWeightInput] = useState({ show: false, buttonText: 'Pesagem' });
    const [showPLgrama, setShowPLgrama] = useState(false);
    const [darkPoints, setDarkPoints] = useState(0);
    const [threshold, setThreshold] = useState(100);
    const [userCount, setUserCount] = useState('');
    const [processedImage, setProcessedImage] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [weight, setWeight] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

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
                let pixelCount = 0;
                let sumX = 0;
                let sumY = 0;

                while (stack.length > 0) {
                    const [cx, cy] = stack.pop();
                    const index = cy * width + cx;

                    if (
                        cx >= 0 && cy >= 0 && cx < width && cy < height &&
                        !visited[index] && brightnessData[index] === 1
                    ) {
                        visited[index] = true;
                        pixelCount++;
                        sumX += cx;
                        sumY += cy;

                        stack.push([cx + 1, cy]);
                        stack.push([cx - 1, cy]);
                        stack.push([cx, cy + 1]);
                        stack.push([cx, cy - 1]);
                    }
                }
                if (pixelCount >= 10) { // Ajuste o tamanho mínimo do ponto escuro
                    const centerX = sumX / pixelCount;
                    const centerY = sumY / pixelCount;

                    // Desenhar um círculo vermelho ao redor do centro do ponto escuro
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI); // raio de 5 pixels
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    return true;
                }
                return false;
            };

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = y * width + x;
                    if (brightnessData[index] === 1 && !visited[index]) {
                        if (dfs(x, y)) darkCount++; // Conta apenas agrupamentos significativos
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

    const adjustCounting = (adj) => {
        let newThreshold = threshold;
        if (adj === 'less') {
            newThreshold += 5;
            setThreshold(newThreshold);
        }
        if (adj === 'more') {
            newThreshold -= 5;
            setThreshold(newThreshold);
        }
        countDarkPoints(capturedImage, newThreshold);
    }

    const adjustThreshold = () => {
        const realCount = parseInt(userCount, 10);
        if (!isNaN(realCount) && realCount > 0) {
            const difference = darkPoints - realCount;
            const adjustment = difference / 20; // Incremento menor para ajuste fino
            setThreshold((prevThreshold) => {
                const newThreshold = Math.max(prevThreshold - adjustment, 0);
                // Reprocessa a imagem com o novo threshold
                countDarkPoints(capturedImage, newThreshold);
                return newThreshold;
            });
        }
    };

    return (
        <>
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
                            // setShowCountPlPopup(false);
                            setShowCamera(true);
                            setShowCamCountPopup(true);
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
                                onClick={() => handleSavePLcount()}
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
                                // videoConstraints={{ facingMode: "user" }}
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
                        {/* <button onClick={() => {
                            if (showAdjustCount.buttonText === 'Ajustar contagem') {
                                setShowAdjustCount({ show: true, buttonText: 'Confirmar ajuste' });
                            } else {
                                setShowAdjustCount({ show: false, buttonText: 'Ajustar contagem' });
                                adjustThreshold();
                            }
                        }}>
                            {showAdjustCount.buttonText}</button> */}
                        <div className="adjust-buttons-container">
                            <button className="adjust-buttons-left" onClick={() => adjustCounting('less')}>-</button>
                            <p>Calibrar<br />contagem</p>
                            <button className="adjust-buttons-right" onClick={() => adjustCounting('more')}>+</button>
                        </div>
                        <button onClick={() => { setShowCamCountPopup(false); setShowCountPlPopup(true) }}>Voltar</button>
                    </div>
                </ div>
            )}
        </>
    );
};

export default CountingPls;