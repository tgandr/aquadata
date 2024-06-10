import React, {useState} from 'react';

const BiometryPopup = ({ 
    viveiroId,
    formBiometry,
    setFormBiometry,
    setShowBiometry,
    setBiometrics }) => {

    const [showBiomCalculated, setShowBiomCalculated] = useState(0);

    const initialFormBiometryState = {
        data: new Date().toISOString().split('T')[0],
        Pesagem: '',
        Contagem: '',
        pesoMedio: null,
    };

    const handleBiometrySubmit = (e) => {
        e.preventDefault();
        const { data, Pesagem, Contagem } = formBiometry;
        if (Pesagem && Contagem) {
            const pesoMedio = (Pesagem / Contagem).toFixed(1);
            const biom = { data, Pesagem, Contagem, pesoMedio };
            let viveiroData = JSON.parse(localStorage.getItem(`cultivo-${viveiroId}`));
            viveiroData.biometrics ? viveiroData.biometrics.push(biom) : viveiroData = {...viveiroData, biometrics: [biom]};
            setBiometrics(viveiroData.biometrics);
            localStorage.setItem(`cultivo-${viveiroId}`, JSON.stringify(viveiroData));
            setFormBiometry(initialFormBiometryState);
            setShowBiomCalculated(pesoMedio);
        }
    };

    return (
        <div className="popup">
          <div className="popup-inner">
            <h3>Anotar Biometria</h3>
            <h3>Peso Médio: {showBiomCalculated} g</h3> 
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
            <button type="button" onClick={() => setShowBiometry(false)}>Fechar</button>
          </div>
        </div>
    )
    
}

export default BiometryPopup;