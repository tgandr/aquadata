import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainFrame.css';

const MainFrame = () => {
  const [viveiros, setViveiros] = useState([]);

  const adicionarViveiro = () => {
    const novoViveiro = {
      id: viveiros.length + 1,
      nome: `Viveiro ${viveiros.length + 1}`
    };
    setViveiros([...viveiros, novoViveiro]);
  };

  return (
    <div className="main-frame">
      <h2>Lista de Viveiros</h2>
      <div className="viveiros-container">
        <button className="adicionar-button" onClick={adicionarViveiro}>Adicionar Viveiro</button>
        {viveiros.map(viveiro => (
          <Link to={`/viveiro-${viveiro.id}`} key={viveiro.id}>
            <button className="viveiro-button">{viveiro.nome}</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainFrame;
