import React, { useEffect, useState } from 'react';
import { formatDate } from './utils';

const FeedPopup = ({ setshowFeedPopup, saveData }) => {
  const [purchases, setPurchases] = useState([]);
  const [uniquePurchases, setUniquePurchases] = useState([]);
  const [formFeed, setFormFeed] = useState({
    data: new Date().toISOString().split('T')[0],
    racaoTotalDia: '',
    quantidadeTratos: '',
    racaoUsada: '',
    observacao1: false,
    observacao2: false,
  });

  const handleFeedSubmit = (e) => {
    e.preventDefault();
    saveData(formFeed, 'feed');
    removeFromStock(formFeed.racaoUsada);
    setshowFeedPopup(false);
  };

  const removeFromStock = (id) => {
    let stock = JSON.parse(localStorage.getItem('stockData'));
    const feedStock = stock.feedPurchase;
    const toUpdate = feedStock.map((item) => {
      if (Number(item.purchaseId.id) === Number(id)) {
        return {...item, quantidade: item.quantidade - formFeed.racaoTotalDia}
      }
      return item;
    })
    stock = {...stock, feedPurchase: toUpdate}
    localStorage.setItem('stockData', JSON.stringify(stock));
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormFeed((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    const checkPurchases = JSON.parse(localStorage.getItem('stockData')) || [];
    if ('feedPurchase' in checkPurchases) {
      setPurchases(checkPurchases.feedPurchase);
    }
  }, []);

  useEffect(() => {
    const uniqueSet = new Set();
    const uniquePurchasesLocal = [];
    purchases.forEach(purchase => {
      const uniqueKey = `${purchase.brand}-${purchase.type}-${purchase.validity}`;
      console.log(uniqueKey)
      if (!uniqueSet.has(uniqueKey)) {
        uniqueSet.add(uniqueKey);
        uniquePurchasesLocal.push({
          id: purchase.purchaseId.id,
          marca: purchase.brand,
          tipo: purchase.type,
          validade: purchase.validity
        });
      }
    });
    setUniquePurchases(uniquePurchasesLocal);
  }, [purchases])

  return (
    <div className="popup">
      <div className="popup-inner">
        {purchases.length > 0 ? (
          <>
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
                Ração usada:
                <select
                  value={formFeed.racaoUsada}
                  onChange={(e) => 
                    setFormFeed({ ...formFeed, racaoUsada: e.target.value })}
                    required>
                  <option value="">Escolha a ração</option>
                  {uniquePurchases.map((op, index) =>
                    <option value={(op.id)} key={index}>{op.marca}-{op.tipo}-{formatDate(op.validade).date}</option>
                  )}
                </select>
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
                <button type="button" onClick={() => setshowFeedPopup(false)} className="cancel-button">Voltar</button>
                <button type="submit" className="first-class-button">Salvar</button>
              </div>
            </form>
          </>
        ) : (
          <div>
            <p>Sem ração no estoque</p>
            <button type="button" onClick={() => setshowFeedPopup(false)} className="cancel-button">Voltar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPopup;
