import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { LoginUseCase, signIn } from '../services/user.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Preferences } from '@capacitor/preferences';
import LocalDb from '../databases/local.db';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await signIn(new LoginUseCase(email, password))
      const user = res.data.user
      const form = {
        id: user.id,
        email: user.email,
        enderecoFazenda: user.farmAddres,
        nomeCompleto: user.name,
        telefone: user.phone,
        nomeFazenda: user.farmName,
        perfil: user.profile,
        saveLogin: false
      }
      await SecureStoragePlugin.set({key: 'token', value: res.data.token})
      await SecureStoragePlugin.set({key:'credentials', value: JSON.stringify({email: user.email, password})})
      await LocalDb.set('user', form)
      navigate('/dashboard')
    } catch (err) {
      setError('Usuário ou senha inválidos');
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
        {error && <p className="error" style={{color: 'red'}}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default LoginPage;
