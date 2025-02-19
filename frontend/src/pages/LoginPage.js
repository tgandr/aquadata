import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch('http://localhost:5000/api/users/login', {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro desconhecido');
      }

      const data = await response.json();

      // Armazenar o token ou dados do usuário em localStorage
      localStorage.setItem('formData', JSON.stringify({ token: data.token, saveLogin: true, ...data.user }));

      // Redirecionar o usuário para a página principal após o login bem-sucedido

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.message); // Log detalhado do erro
      setError(error.message || 'Erro desconhecido');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default LoginPage;
