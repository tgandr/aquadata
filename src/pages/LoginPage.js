import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Certifique-se de que tudo está importado corretamente
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToMain, setRedirectToMain] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticação aqui
    // Se a autenticação for bem-sucedida, redirecione para AddPonds.js
    setRedirectToMain(true);
  };

  useEffect(() => {
    if (redirectToMain) {
      navigate('/viveiros');
    }
  }, [redirectToMain, navigate]);

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link></p>
    </div>
  );
};

export default LoginPage;
