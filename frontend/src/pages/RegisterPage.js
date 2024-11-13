// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import '../styles/RegisterPage.css';

// const RegisterPage = () => {
//   const [form, setForm] = useState({
//     nomeCompleto: '',
//     email: '',
//     senha: '',
//     confirmarSenha: '',
//     telefone: '',
//     enderecoFazenda: '',
//     nomeFazenda: '',
//     perfil: '',
//     saveLogin: true,
//   });

//   const [password, setPassword] = useState({
//     senha: '',
//     confirmarSenha: ''
// });

//   const [showPassword, setShowPassword] = useState(false); // Estado para controlar visualização da senha
//   const navigate = useNavigate();

//   const storedData = JSON.parse(localStorage.getItem('formData')) || {};
//   if (storedData.eraseLocalStorageAfterLogout) {
//     localStorage.clear();
//   }

//   const handleChange = (e) => {
//     if (e.target.name !== ('senha' || 'confirmarSenha')) {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     } else {
//       setPassword(e.target.value);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     localStorage.setItem('formData', JSON.stringify(form));
//     navigate('/dashboard');
//     try {
//       // const response = await axios.post('http://localhost:3000/api/users/register', form);
//       const response = await axios.post('https://aqua-data-bf42d2da5cff.herokuapp.com/api/users/register', form);
//       if (response.status === 201) {
//         navigate('/dashboard');
//       }
//     } catch (error) {
//       console.error('Erro ao registrar usuário:', error);
//     }
//   };

//   return (
//     <div className="register-page">
//       <h2>Cadastro</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" name="nomeCompleto" placeholder="Nome Completo" value={form.nomeCompleto} onChange={handleChange} required />
//         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        
//         <div className="password-input">
//           <input type={showPassword ? "text" : "password"} name="senha" placeholder="Senha" value={password.senha} onChange={handleChange} required />
//           <button type="button" onClick={togglePasswordVisibility}>
//             <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//           </button>
//         </div>
//         <input type="password" name="confirmarSenha" placeholder="Confirmar Senha" value={password.confirmarSenha} onChange={handleChange} required />
//         <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
//         <input type="text" name="enderecoFazenda" placeholder="Endereço da Fazenda" value={form.enderecoFazenda} onChange={handleChange} required />
//         <input type="text" name="nomeFazenda" placeholder="Nome da Fazenda" value={form.nomeFazenda} onChange={handleChange} required />
//         <select name="perfil" value={form.perfil} onChange={handleChange} required>
//           <option value="" disabled>Perfil</option>
//           <option value="produtor">Carcinicultor</option>
//           <option value="tecnico">Piscicultor</option>
//           <option value="fornecedor">Consultor</option>
//         </select>
//         <button type="submit">Cadastrar</button>
//       </form>
//       <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
//     </div>
//   );
// };

// export default RegisterPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const generateId = () => {
        // Gera um _id simples para simulação
        return Math.random().toString(36).substr(2, 9);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simular um ID para o usuário registrado
        const userId = generateId();

        // Criar o objeto a ser salvo no LocalStorage
        const user = {
            _id: userId,
            nomeCompleto: formData.nomeCompleto,
            email: formData.email,
            telefone: formData.telefone,
            enderecoFazenda: formData.enderecoFazenda,
            nomeFazenda: formData.nomeFazenda,
            perfil: formData.perfil,
            saveLogin: true,
            __v: 0 // Valor fixo para simulação
        };

        // Salvar o objeto no LocalStorage
        localStorage.setItem('formData', JSON.stringify(user));

        // Definir sucesso e limpar erros
        setSuccess('Registro realizado com sucesso!');
        setError('');
        navigate('/dashboard');
    };

    return (
        <div>
            <h2>Registro de Usuário</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome Completo:</label>
                    <input
                        type="text"
                        name="nomeCompleto"
                        value={formData.nomeCompleto}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Telefone:</label>
                    <input
                        type="text"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Endereço da Fazenda:</label>
                    <input
                        type="text"
                        name="enderecoFazenda"
                        value={formData.enderecoFazenda}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Nome da Fazenda:</label>
                    <input
                        type="text"
                        name="nomeFazenda"
                        value={formData.nomeFazenda}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Perfil:</label>
                    <input
                        type="text"
                        name="perfil"
                        value={formData.perfil}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default RegisterPage;
