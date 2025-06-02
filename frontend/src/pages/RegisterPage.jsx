import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { signUp, RegisterUserUseCase } from '../services/user.service';
import {Preferences} from '@capacitor/preferences'
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import LocalDb from '../databases/local.db';
import UiLoading from '../ui/UiLoading';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError('')
        const user = {
            nomeCompleto: form.nomeCompleto,
            email: form.email,
            telefone: form.telefone,
            enderecoFazenda: form.enderecoFazenda,
            nomeFazenda: form.nomeFazenda,
            perfil: form.perfil,
            saveLogin: true,
            isSubscriptionActive: false,
        };
        try {
            const res = await signUp(new RegisterUserUseCase(
                user.nomeCompleto,
                user.email,
                password.senha,
                user.nomeFazenda,
                user.enderecoFazenda,
                user.perfil,
                user.telefone
            ))
            user.id = res.data.user.id

            await SecureStoragePlugin.set({key:'credentials', value: JSON.stringify({email: user.email, password: password.senha})})
            await LocalDb.set('user', user);
            setSuccess('Registro realizado com sucesso!');
            setError('');
            navigate('/splash-screen');
        } catch (error) {
            switch (error.message.toLowerCase()) {
                case "failed to fetch":
                    setError('Falha na conexão')
                    break;
                case "email already exists":
                    setError("Este email já foi cadastrado");
                    break;
                default: 
                    setError("Erro Desconhecido")     
            }
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <div className="register-page">
            <h2>Registro de Usuário</h2>
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading && <div className='loading'>
                    <UiLoading/>
                </div>}
            </form>
        </div>
    );
};

export default RegisterPage;
