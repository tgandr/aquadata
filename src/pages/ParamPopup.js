import React, {useState} from 'react';

const ParamPopup = ({setShowParamPopup}) => {
    const [formParam, setFormParam] = useState({
        data: new Date().toISOString().split('T')[0],
        horario: '',
        temperartura:'',
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
        console.log(formParam);
        setShowParamPopup(false);
    };

    return (
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
    )
}

export default ParamPopup;