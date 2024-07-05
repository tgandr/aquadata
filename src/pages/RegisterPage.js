import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    enderecoFazenda: '',
    nomeFazenda: '',
    perfil: '', 
    saveLogin: true,
  });

  const navigate = useNavigate();

  const storedData = JSON.parse(localStorage.getItem('formData')) || {};
    if (storedData.eraseLocalStorageAfterLogout) {
      localStorage.clear();
    }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('formData', JSON.stringify(form));
    navigate('/dashboard');
    try {
      // const response = await axios.post('http://localhost:3000/api/users/register', form);
      const response = await axios.post('https://aqua-data-bf42d2da5cff.herokuapp.com/api/users/register', form);
      if (response.status === 201) {
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  };

  return (
    <div className="register-page">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nomeCompleto" placeholder="Nome Completo" value={form.nomeCompleto} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} required />
        <input type="password" name="confirmarSenha" placeholder="Confirmar Senha" value={form.confirmarSenha} onChange={handleChange} required />
        <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
        <input type="text" name="enderecoFazenda" placeholder="Endereço da Fazenda" value={form.enderecoFazenda} onChange={handleChange} required />
        <input type="text" name="nomeFazenda" placeholder="Nome da Fazenda" value={form.nomeFazenda} onChange={handleChange} required />
        <select name="perfil" value={form.perfil} onChange={handleChange} required>
          <option value="" disabled>Perfil</option>
          <option value="produtor">Carcinicultor</option>
          <option value="tecnico">Piscicultor</option>
          <option value="fornecedor">Consultor</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
};

export default RegisterPage;
