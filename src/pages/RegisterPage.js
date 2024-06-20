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
    perfil: '', // perfil padrão
    tipoInsumo: '', // tipo de insumo selecionado
    saveLogin: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {email, senha} = form;
    
    try {
      // Enviar os dados do formulário para o backend
      const response = await axios.post('http://localhost:5000/aquadata/api/users/register', { email, senha });
      console.log('passei aqui')
      
      console.log('Resposta do backend:', response.data);

      // Limpar o formulário após o envio
      setForm({
        nomeCompleto: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        telefone: '',
        enderecoFazenda: '',
        nomeFazenda: '',
        perfil: '',
        tipoInsumo: '',
        saveLogin: true,
      });

      // Navegar para a página de dashboard após o registro
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      // Aqui você pode adicionar tratamento de erro, exibir uma mensagem, etc.
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
