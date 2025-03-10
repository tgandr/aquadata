import React from "react";

const TransportParameters = ({formParam, setFormParam, setShowParameters}) => {
    const handleParametersChangeSubmit = (e) => {
        console.log(e.target)
        e.preventDefault();
        setShowParameters(false);
    }

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

    return (
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
                            <option value={true}>Sim</option>
                            <option value={false}>Não</option>
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
                                        <td>Oxigênio - mg/L</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.oxygen.transp}
                                                onChange={(e) => handleParametersChange(e, 'oxygen', 'transp')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.oxygen.pond}
                                                onChange={(e) => handleParametersChange(e, 'oxygen', 'pond')}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Temperatura - ºC</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.temperature.transp}
                                                onChange={(e) => handleParametersChange(e, 'temperature', 'transp')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.temperature.pond}
                                                onChange={(e) => handleParametersChange(e, 'temperature', 'pond')}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>pH</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.ph.transp}
                                                onChange={(e) => handleParametersChange(e, 'ph', 'transp')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.ph.pond}
                                                onChange={(e) => handleParametersChange(e, 'ph', 'pond')}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Salinidade - g/L</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.salinity.transp}
                                                onChange={(e) => handleParametersChange(e, 'salinity', 'transp')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.salinity.pond}
                                                onChange={(e) => handleParametersChange(e, 'salinity', 'pond')}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Amônia - mg/L</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.ammonium.transp}
                                                onChange={(e) => handleParametersChange(e, 'ammonium', 'transp')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.ammonium.pond}
                                                onChange={(e) => handleParametersChange(e, 'ammonium', 'pond')}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Nitrito - mg/L</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={formParam.nitrite.transp}
                                                onChange={(e) => handleParametersChange(e, 'nitrite', 'transp')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
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
                            // onClick={() => handleStressTestClick('Sim')}
                            className="first-class-button">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransportParameters;