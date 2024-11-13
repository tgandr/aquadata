import React, { useEffect, useState } from 'react';
import { formatDate } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const FeedPopup = ({ setShowFeedPopup, saveData, cultivo, setCultivo }) => {
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

  const [showTablePopup, setShowTablePopup] = useState(false);
  const [lastFiveFeeds, setLastFiveFeeds] = useState([]);
  const [showLastFeeds, setShowLastFeeds] = useState(false);
  const [edit, setEdit] = useState({
    check: false,
    id: '',
    time: '',
    data: ''
  });
  const [isPopup, setIsPopup] = useState(false);

  const handleFeedSubmit = (e) => {
    e.preventDefault();
    if (edit.check) {
      submitEdit(edit);
      setShowTablePopup(true);
      setShowLastFeeds(true);
      setEdit({
        check: false,
        id: '',
        time: '',
        data: ''
      });
      setIsPopup(true);
      return;
    }

    const selectedPurchase = purchases.find((purchase) => purchase.purchaseId.id === formFeed.racaoUsada);

    if (selectedPurchase && selectedPurchase.quantity - formFeed.racaoTotalDia < 0) {
      alert(`Quantidade insuficiente no estoque.\nDisponível apenas ${selectedPurchase.quantity} kg`);
      return;
    }

    const checkOut = { ...formFeed, time: new Date().toLocaleTimeString() }
    saveData(checkOut, 'feed');
    removeFromStock(formFeed.racaoUsada);
    updateLastFiveFeeds();
    setShowTablePopup(true);
    setShowLastFeeds(true);
    setIsPopup(true);
    setEdit({
      check: false,
      id: '',
      time: '',
      data: ''
    });
  };

  const removeFromStock = (id) => {
    let stock = JSON.parse(localStorage.getItem('stockData'));
    const feedStock = stock.feedPurchase;
    const toUpdate = feedStock.map((item) => {
      if (item.purchaseId.id === id) {
        return { ...item, quantity: item.quantity - formFeed.racaoTotalDia }
      }
      return item;
    })
    stock = { ...stock, feedPurchase: toUpdate }
    localStorage.setItem('stockData', JSON.stringify(stock));
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormFeed((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const updateLastFiveFeeds = () => {
    cultivo.feed && setLastFiveFeeds(cultivo.feed.slice(-5).reverse());
  };

  useEffect(() => {
    updateLastFiveFeeds();
  }, [cultivo]);

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
  }, [purchases]);

  const handleEditItem = (id, time, data) => {
    setShowLastFeeds(false);
    setIsPopup(false);
    setEdit({
      check: true,
      id: id,
      time: time,
      data: data
    });
    const feedToEdit = cultivo.feed.find(
      (feed) => feed.racaoUsada === id && feed.time === time && feed.data === data
    );

    if (feedToEdit) {
      setFormFeed({
        data: feedToEdit.data,
        racaoTotalDia: feedToEdit.racaoTotalDia,
        quantidadeTratos: feedToEdit.quantidadeTratos,
        racaoUsada: feedToEdit.racaoUsada,
        observacao1: feedToEdit.observacao1,
        observacao2: feedToEdit.observacao2,
      });
      setShowTablePopup(false);
    }
  };

  const submitEdit = (edit) => {
    const { id, time, data } = edit;
    let history = JSON.parse(localStorage.getItem('history'));
    history = history.filter(c => c.id !== cultivo.id);
    const editFeedFromCultivo = cultivo.feed.filter((feed) =>
      !(feed.racaoUsada === id && feed.time === time && feed.data === data)
    );
    const insertTimeInFormFeed = {...formFeed, time: time}
    const updateFeedAfterEdit = [...editFeedFromCultivo, insertTimeInFormFeed]
    const updateCultivo = { ...cultivo, feed: updateFeedAfterEdit }
    history = [...history, updateCultivo];
    setCultivo(updateCultivo);
    localStorage.setItem(`cultivo-${cultivo.id}`, JSON.stringify(updateCultivo));
    localStorage.setItem(`history`, JSON.stringify(history));
    updateLastFiveFeeds();
  }
  const handleDeleteItem = (id, time, data) => {
    if (window.confirm('Tem certeza de que deseja excluir este item?')) {
      let history = JSON.parse(localStorage.getItem('history'));
      history = history.filter(c => c.id !== cultivo.id);
  
      // Encontrar o item a ser removido
      const itemToRemove = cultivo.feed.find((feed) =>
        feed.racaoUsada === id &&
        feed.time === time &&
        feed.data === data
      );
  
      // Remover o item do cultivo.feed
      const removeFeedFromCultivo = cultivo.feed.filter((feed) =>
        feed.racaoUsada !== id ||
        feed.time !== time ||
        feed.data !== data
      );
  
      // Atualizar o cultivo com o item removido
      const updateCultivo = { ...cultivo, feed: removeFeedFromCultivo }
      history = [...history, updateCultivo];
      setCultivo(updateCultivo);
      localStorage.setItem(`cultivo-${cultivo.id}`, JSON.stringify(updateCultivo));
      localStorage.setItem(`history`, JSON.stringify(history));
  
      // Devolver a quantidade removida ao estoque
      let stock = JSON.parse(localStorage.getItem('stockData'));
      const feedStock = stock.feedPurchase.map((item) => {
        if (item.purchaseId.id === id) {
          return { ...item, quantity: parseFloat(item.quantity) + parseFloat(itemToRemove.racaoTotalDia) };
        }
        return item;
      });
      stock = { ...stock, feedPurchase: feedStock };
      localStorage.setItem('stockData', JSON.stringify(stock));
  
      updateLastFiveFeeds();
    }
  };

  const renderTable = (data) => {
    let feeds = [];
    data.forEach((feed) => {
      const f = purchases.filter(i => i.purchaseId.id === feed.racaoUsada)[0];
      feeds.push({ ...feed, marca: f.brand, tipo: f.type });
    });

    const getFeedIndex = (date, time) => {
      const sameDayFeeds = feeds.filter((feed) => feed.data === date);
      const sortedFeeds = sameDayFeeds.sort((a, b) => new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`));
      const index = sortedFeeds.findIndex((feed) => feed.time === time);
      return `${index + 1}º trato`;
    };


    if (!data.length) {
      return <p>Nenhuma alimentação lançada</p>;
    }
    return (
      <div className="feed-table">
        {isPopup ?
          (<h3>Últimas anotações</h3>) :
          (<h4 className="toggle-title" onClick={() => setShowLastFeeds(!showLastFeeds)}>
            <span>Últimas anotações</span>
            <span><FontAwesomeIcon
              icon={faChevronDown}
              className={`toggle-icon ${showLastFeeds ? '' : 'rotate-icon'}`}
            /></span>
          </h4>)
        }
        {showLastFeeds && (
          <table className="biometry-table">
            <thead>
              <tr>
                <th>Data/<br />Hora</th>
                <th>Ração</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {feeds.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.data).date}<br />
                    {/* {renderTime(item.time)} */}
                    {getFeedIndex(item.data, item.time)}
                  </td>

                  <td>{`${item.marca} - ${item.tipo} - ${item.racaoTotalDia}`} kg</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="delete-button"
                      onClick={() => (handleEditItem(item.racaoUsada, item.time, item.data),
                        setShowLastFeeds(false))}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="delete-button" onClick={() => handleDeleteItem(item.racaoUsada, item.time, item.data)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (cultivo.feed) {
      const lastUsedFeed = purchases.filter((f) => f.purchaseId.id === cultivo.feed[cultivo.feed.length - 1].racaoUsada)[0];
      if (lastUsedFeed && lastUsedFeed.quantity < 100) {
        alert(`Atenção: O estoque da ração ${lastUsedFeed.brand}-${lastUsedFeed.type} é ${lastUsedFeed.quantity} kg.`);
      }
    }
  }, [purchases]);

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
                Ração total do dia (kg):
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
              </div>
              
              <div className="box-buttons">
                <button type="button" onClick={() => setShowFeedPopup(false)} className="cancel-button">Voltar</button>
                <button type="submit" className="first-class-button">Salvar</button>
              </div>
            </form>
            {renderTable(lastFiveFeeds)}
          </>
        ) : (
          <div>
            <p>Sem ração no estoque</p>
            <button
              type="button"
              onClick={() => setShowFeedPopup(false)} className="cancel-button">
              Voltar
            </button>
          </div>
        )}
      </div>

      {showTablePopup && (
        <div className="popup">
          <div className="popup-inner">
            {renderTable(lastFiveFeeds)}
            <button onClick={() => (setShowTablePopup(false), setShowFeedPopup(false))} className="cancel-button">
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeedPopup;
