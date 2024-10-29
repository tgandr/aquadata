import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await axios.post('https://aqua-data-bf42d2da5cff.herokuapp.com/api/users/login', {
      //   email,
      //   senha: password
      // });

      // const { token } = response.data;

      // if (token) {
      //   localStorage.setItem('token', token);

      //   // Fetch user details using the token
      //   const userResponse = await axios.get('https://aqua-data-bf42d2da5cff.herokuapp.com/api/users/me', {
      //     headers: {
      //       'Authorization': `Bearer ${token}`
      //     }
      //   });

      //   const user = userResponse.data;
      //   let formData = { ...user, saveLogin: true };
      //   localStorage.setItem('formData', JSON.stringify(formData));
      //   navigate('/dashboard');
      // } else {
      //   setError('Credenciais inválidas');
      // }
      const formData = JSON.parse(localStorage.getItem("formData"));
      if (email === formData.email) {
        navigate('/dashboard');
      } else {
        if (email === "fazenda@aquadata.com") {
          formData = {
            _id: "668d2fdf298ed64ee6c34a7a",
            nomeCompleto: "Fazenda AquaData MN",
            email: "fazenda@aquadata.com",
            telefone: "85 99261 2616",
            enderecoFazenda: "Morada Nova",
            nomeFazenda: "Aqua Data",
            perfil: "Consultor",
            saveLogin: false,
            __v: 0
          }
          localStorage.setItem("formData", JSON.stringify(formData));
          navigate('/dashboard');
        } else {
          setError('Credenciais inválidas');
        }
      }
    } catch (error) {
      console.error('Login error:', error);  // Adicione esta linha para logar o erro
      setError('Erro ao tentar fazer login. Por favor, tente novamente.');
    }
  };

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
