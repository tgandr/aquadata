import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nomeCompleto: '',
        email: '',
        senha: '',
        telefone: '',
        enderecoFazenda: '',
        nomeFazenda: '',
        perfil: '',
        saveLogin: false
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const togglePasswordVisibility = (check) => {
        if (check === "password") {
            setShowPassword(!showPassword);
        }
        if (check === "checkPassword")
            setShowPasswordCheck(!showPasswordCheck);
    };
    const [password, setPassword] = useState({
        senha: '',
        confirmarSenha: ''
    });
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleChange = (e) => {
        if (e.target.name !== 'senha' && e.target.name !== 'confirmarSenha') {
            setForm({ ...form, [e.target.name]: e.target.value });
        } else {
            const updatedPassword = { ...password, [e.target.name]: e.target.value };
            setPassword(updatedPassword);

            // Checagem de correspondência de senha
            if (updatedPassword.senha && updatedPassword.confirmarSenha) {
                setPasswordMatch(updatedPassword.senha === updatedPassword.confirmarSenha);
            }
        }
    };

    // const generateId = () => {
    //     // Gera um _id simples para simulação
    //     return Math.random().toString(36).substr(2, 9);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            nomeCompleto: form.nomeCompleto,
            email: form.email,
            telefone: form.telefone,
            enderecoFazenda: form.enderecoFazenda,
            nomeFazenda: form.nomeFazenda,
            perfil: form.perfil,
            saveLogin: true,
            senha: password.senha
        };

        try {
            // Requisição POST para salvar o usuário no banco de dados
            // const response = await fetch('http://localhost:5000/api/users/register', {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Erro ao registrar o usuário');
            }

            // Definir sucesso e limpar erros
            setSuccess('Registro realizado com sucesso!');
            setError('');

            // Navegar para o dashboard
            navigate('/dashboard');
        } catch (error) {
            // Definir mensagem de erro caso a requisição falhe
            setError(error.message);
        }
    };

    return (
        <div className="register-page">
            <h2>Registro de Usuário</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="nomeCompleto" placeholder="Nome Completo" value={form.nomeCompleto} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

                <div className="password-input">
                    <input type={showPassword ? "text" : "password"} name="senha" placeholder="Senha" value={password.senha} onChange={handleChange} required />
                    <button type="button" onClick={() => togglePasswordVisibility("password")}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <div className="password-input">
                    <input type={showPasswordCheck ? "text" : "password"} name="confirmarSenha" placeholder="Confirmar Senha" value={password.confirmarSenha} onChange={handleChange} required />
                    <button type="button" onClick={() => togglePasswordVisibility("checkPassword")}>
                        <FontAwesomeIcon icon={showPasswordCheck ? faEyeSlash : faEye} />
                    </button>
                </div>
                {password.confirmarSenha ? (
                    <p style={{ color: passwordMatch ? 'green' : 'red' }}>
                        {passwordMatch ? 'Senhas conferem' : 'Senhas não conferem'}
                    </p>
                ) : (<p>Escolha uma senha</p>)}

                <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
                <input type="text" name="enderecoFazenda" placeholder="Endereço da Fazenda" value={form.enderecoFazenda} onChange={handleChange} required />
                <input type="text" name="nomeFazenda" placeholder="Nome da Fazenda" value={form.nomeFazenda} onChange={handleChange} required />
                <select name="perfil" value={form.perfil} onChange={handleChange} required>
                    <option value="" disabled>Perfil</option>
                    <option value="produtor">Produtor</option>
                    <option value="tecnico">Técnico</option>
                    <option value="fornecedor">Fornecedor</option>
                </select>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};

export default RegisterPage;
