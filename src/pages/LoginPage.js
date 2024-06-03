import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Certifique-se de que tudo está importado corretamente
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToMain, setRedirectToMain] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const storedData = JSON.parse(localStorage.getItem('formData'));
    if (storedData.email === email) {
      storedData.saveLogin = true;
      localStorage.setItem('formData', JSON.stringify(storedData));
      navigate('/dashboard');
    } else {
      alert('Email ou senha inválidos!');
    }
  };  // Login verifica apenas o e-mail. Objetivo de demonstração.

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
