import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import axios from 'axios';
import Example from './Example';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToExample, setRedirectToExample] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const storedData = JSON.parse(localStorage.getItem('formData')) || {};
    // if (storedData.eraseLocalStorageAfterLogout) {
    //   localStorage.clear();
    // }
    // if (email === 'fazenda@aquadata.com') {
    //   Example(redirectToExample);
    //   navigate('/dashboard');
    // } else {
    //   if (storedData.email === email) {
    //     storedData.saveLogin = true;
    //     localStorage.setItem('formData', JSON.stringify(storedData));
    //     navigate('/dashboard');
    //   } else {
    //     alert('Email ou senha inválidos!');
    //   }
    // }

    try {
      const response = await axios.post('https://aqua-data-bf42d2da5cff.herokuapp.com/api/users/login', {
        email,
        senha: password
      });

      const { token } = response.data;

      if (token) {
        console.log('deu certo')
        console.log(token)
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (error) {
      setError('Erro ao tentar fazer login. Por favor, tente novamente.');
    }

    
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
