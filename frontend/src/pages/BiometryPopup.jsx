import React, { useState } from 'react';

const BiometryPopup = ({
  viveiroId,
  formBiometry,
  setFormBiometry,
  setShowBiometry,
  setBiometrics, database,
  cultivation,
  setCultivation
}) => {
  const [showBiomCalculated, setShowBiomCalculated] = useState(0);
  const [calculateOrInsert, showCalculateOrInsert] = useState();
  const [showButtons, setShowButtons] = useState(true);
  const [insertValueBiom, setInsertValueBiom] = useState('');

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
      // const storedCultivos = JSON.parse(localStorage.getItem(`history`));
      // let storedCultivo = storedCultivos && storedCultivos.find((viv) => viv.viveiroId === viveiroId);
      cultivation.biometrics ?
      cultivation.biometrics.push(biom) :
      cultivation = { ...cultivation, biometrics: [biom] };
      setBiometrics(cultivation.biometrics);
      // storedCultivos.forEach((elem, i) => {
        //   elem.id === storedCultivo.id && (storedCultivos[i] = storedCultivo)
        // })
        // localStorage.setItem(`cultivo-${storedCultivo.id}`, JSON.stringify(storedCultivo));
        // localStorage.setItem('history', JSON.stringify(storedCultivos));
        database.put(cultivation).then(response => {
          cultivation._rev = response.rev
          setCultivation(cultivation)
      })
      setFormBiometry(initialFormBiometryState);
      setShowBiomCalculated(pesoMedio);
      setShowBiometry(false)
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Biometria</h3>

        <form onSubmit={handleBiometrySubmit} className="harv-form">

          {showButtons &&
            <>
              <button onClick={() => { showCalculateOrInsert("calculate"); setShowButtons(false) }}>Calcular biometria</button>
              <button onClick={() => { showCalculateOrInsert("insert"); setShowButtons(false) }}>Anotar biometria</button>
            </>
          }

          {calculateOrInsert === "calculate" &&
            <>
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
            </>
          }

          {calculateOrInsert === "insert" &&
            <>
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
                Peso médio - em gramas:
                <input
                  type="number"
                  name="pesoCalculado"
                  value={insertValueBiom}
                  onChange={(e) => {
                    setInsertValueBiom(e.target.value);
                    setFormBiometry({ ...formBiometry, Contagem: 1, Pesagem: e.target.value, pesoMedio: e.target.value })
                  }}
                  required
                />
              </label>
            </>
          }

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