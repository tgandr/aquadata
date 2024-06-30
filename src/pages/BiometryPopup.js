import React, { useState } from 'react';

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
      const storedCultivos = JSON.parse(localStorage.getItem(`history`));
      let storedCultivo = storedCultivos && storedCultivos.find((viv) => viv.viveiroId === viveiroId);
      storedCultivo.biometrics ?
        storedCultivo.biometrics.push(biom) :
        storedCultivo = { ...storedCultivo, biometrics: [biom] };
      setBiometrics(storedCultivo.biometrics);
      storedCultivos.forEach((elem, i) => {
        elem.id === storedCultivo.id && (storedCultivos[i] = storedCultivo)
      })
      localStorage.setItem(`cultivo-${storedCultivo.id}`, JSON.stringify(storedCultivo));
      localStorage.setItem('history', JSON.stringify(storedCultivos));
      setFormBiometry(initialFormBiometryState);
      setShowBiomCalculated(pesoMedio);
      setShowBiometry(false)
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Anotar Biometria</h3>

        <form onSubmit={handleBiometrySubmit} className="harv-form">
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
          {formBiometry.Contagem &&
            <h3>Peso médio:&nbsp;{(formBiometry.Pesagem / formBiometry.Contagem).toLocaleString('pt-BR',
              { minimumFractionDigits: 1, maximumFractionDigits: 1 }
            )}</h3>}
          <br />
          <br />
          <br />
          <div className="bottom-buttons">
            <button
              type="button"
              onClick={() => setShowBiometry(false)}
              className="cancel-button">
              Voltar
            </button>
            <button
              type="submit"
              className="first-class-button">
              Anotar
            </button>
          </div>
        </form>
      </div>
    </div>
  )

}

export default BiometryPopup;