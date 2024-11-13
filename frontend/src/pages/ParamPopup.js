import React, { useState } from 'react';

const ParamPopup = ({ setShowParamPopup, saveData }) => {
    const [formParam, setFormParam] = useState({
        data: new Date().toISOString().split('T')[0],
        horario: '',
        temperatura: '',
        oxigenioDissolvido: '',
        ph: '',
        amoniaTotal: '',
    });

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setFormParam({ ...formParam, [name]: value });
    };

    const handleParamSubmit = (e) => {
        e.preventDefault();
        saveData(formParam, 'params')
        console.log(formParam);
        setShowParamPopup(false);
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Parâmetros da Água</h3>
                <form onSubmit={handleParamSubmit} className="harv-form">
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
                        Temperatura - ºC:
                        <input
                            type="number"
                            name="temperatura"
                            value={formParam.temperatura}
                            onChange={handleParamChange}
                        />
                    </label>
                    <label>
                        Oxigênio Dissolvido - mg/L:
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
                        Amônia Total - mg/L:
                        <input
                            type="number"
                            name="amoniaTotal"
                            value={formParam.amoniaTotal}
                            onChange={handleParamChange}
                        />
                    </label>
                    <br />
                    <br />
                    <div className="bottom-buttons">
                        <button type="button" onClick={() => setShowParamPopup(false)} className="cancel-button">Voltar</button>
                        <button type="submit" className="first-class-button">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ParamPopup;