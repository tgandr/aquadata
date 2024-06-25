import React, { useState } from 'react';

const FeedPopup = ({ setshowFeedPopup, saveData }) => {
  const [formFeed, setFormFeed] = useState({
    data: new Date().toISOString().split('T')[0],
    racaoTotalDia: '',
    quantidadeTratos: '',
    observacao1: false,
    observacao2: false,
  });

  const handleFeedSubmit = (e) => {
    e.preventDefault();
    saveData(formFeed, 'feed');
    console.log(formFeed);
    setshowFeedPopup(false);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(name, checked);
    setFormFeed((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Anotações de Arraçoamento</h3>
        <form onSubmit={handleFeedSubmit} className="harv-form">
          <label>
            Data:
            <input
              type="date"
              name="data"
              value={formFeed.data}
              onChange={(e) => setFormFeed({ ...formFeed, data: e.target.value })}
              required
            />
          </label>
          <label>
            Ração total do dia:
            <input
              type="number"
              name="racaoTotalDia"
              value={formFeed.racaoTotalDia}
              onChange={(e) => setFormFeed({ ...formFeed, racaoTotalDia: e.target.value })}
              required
            />
          </label>
          <label>
            Quantidade de tratos:
            <input
              type="number"
              name="quantidadeTratos"
              value={formFeed.quantidadeTratos}
              onChange={(e) => setFormFeed({ ...formFeed, quantidadeTratos: e.target.value })}
              required
            />
          </label>
          <div className="obs">
            <h3>Observações:</h3>
            <div className="obs-in">
              <label>
                <input
                  type="checkbox"
                  name="observacao1"
                  checked={formFeed.observacao1}
                  onChange={handleCheckboxChange}
                  className="checkbox-reset"
                />
                <span>Houve sobras de ração</span>
              </label>
            </div>
            <div className="obs-in">
              <label>
                <input
                  type="checkbox"
                  name="observacao2"
                  checked={formFeed.observacao2}
                  onChange={handleCheckboxChange}
                  className="checkbox-reset"
                />
                <span>Reduziu ou suspendeu algum trato</span>
              </label>
            </div>
                <br />
                <br />
          </div>
          <div className="bottom-buttons">
            <button type="button" onClick={() => setshowFeedPopup(false)} className="cancel-button">Cancelar</button>
            <button type="submit" className="first-class-button">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedPopup;
