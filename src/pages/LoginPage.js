import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import Example from './Example';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToExample, setRedirectToExample] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const storedData = JSON.parse(localStorage.getItem('formData')) || {};
    if (storedData.eraseLocalStorageAfterLogout) {
      localStorage.clear();
    }
    if (email === 'fazenda@aquadata.com') {
      Example(redirectToExample);
      navigate('/dashboard');
    } else {
      if (storedData.email === email) {
        storedData.saveLogin = true;
        localStorage.setItem('formData', JSON.stringify(storedData));
        navigate('/dashboard');
      } else {
        alert('Email ou senha inválidos!');
      }
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
