import React from 'react';
import { useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const formData = JSON.parse(localStorage.getItem('formData'));

    if (formData) {
      formData.saveLogin = false;
      localStorage.setItem('formData', JSON.stringify(formData));
    }

    navigate('/login');
  };

  return (
    <div>
      <h2>Início</h2>
      <button onClick={() => navigate('/viveiros')}>Produção</button>
      <button onClick={() => navigate('/estoque')}>Controle de Estoque</button>
      <button onClick={() => navigate('/financeiro')}>Financeiro</button>
      <button onClick={handleLogout}>Sair da Conta</button>
      <div>
        <br />
        <br />
        <br />
        <br />
        <img src={aquaDataIcon} alt="Aqua Data Icon" style={{ width: '100px', height: '100px' }} />
      </div>
    </div>
  );
};

export default Dashboard;
