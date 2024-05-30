import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    perfil: 'produtor', // perfil padrão
    tipoInsumo: '', // tipo de insumo selecionado
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de cadastro
    navigate('/confirmation');
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

        {/* Dropdown para seleção de perfil */}
        <div className="select-container">
          <label htmlFor="perfil">Perfil:</label>
          <select name="perfil" id="perfil" value={form.perfil} onChange={handleChange}>
            <option className="placeholder-option" value="" disabled>Perfil</option>
            <option value="produtor">Produtor</option>
            <option value="tecnico">Técnico</option>
            <option value="fornecedor">Fornecedor</option>
          </select>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
};

export default RegisterPage;
