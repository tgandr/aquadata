import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import Example from './Example';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToExample, setRedirectToExample] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem('formData')) || {};
      localStorage.clear();
    if (storedData.eraseLocalStorageAfterLogout) {
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
    // try {
    //   const response = await fetch('http://localhost:5000/api/auth/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     localStorage.setItem('token', data.token);
    //     navigate('/dashboard');
    //   } else {
    //     setError(data.error);
    //   }
    // } catch (error) {
    //   setError('An error occurred. Please try again.');
    // }
  };  // Login verifica apenas o e-mail. Objetivo de demonstração.

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link></p>
    </div>
  );
};

export default LoginPage;
