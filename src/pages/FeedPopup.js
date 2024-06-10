import React, {useState} from 'react';

const FeedPopup = ({setshowFeedPopup}) => {
    const [formFeed, setFormFeed] = useState({
        data: new Date().toISOString().split('T')[0],
        racaoTotalDia: '',
        quantidadeTratos: '',
        observacao1: false,
        observacao2: false,
    });

    const handleFeedSubmit = (e) => {
        e.preventDefault();
        console.log(formFeed);
        setshowFeedPopup(false);
    };

    return (
        <div className="popup">
          <div className="popup-inner">
            <h3>Anotações de Arraçoamento</h3>
            <form onSubmit={handleFeedSubmit}>
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
              <div className='obs'>
                <label>
                  Observações:
                </label>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="observacao1"
                      checked={formFeed.observacao1}
                      onChange={(e) => setFormFeed({ ...formFeed, observacao1: e.target.checked })}
                    />
                    Houve sobras de ração
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="observacao2"
                      checked={formFeed.observacao2}
                      onChange={(e) => setFormFeed({ ...formFeed, observacao2: e.target.checked })}
                    />
                    Reduziu ou suspendeu algum trato
                  </label>
                </div>
              </div>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setshowFeedPopup(false)}>Cancelar</button>
            </form>
          </div>
        </div>
    )
}

export default FeedPopup;