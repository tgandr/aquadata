import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { LoginUseCase, signIn } from '../services/user.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import LocalDb from '../databases/local.db';
import UiLoading from '../ui/UiLoading';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let user;
      let isManager;
      const res = await signIn(new LoginUseCase(email, password))
      if (email.match(/^[1-9]{2}9\d{8}$/)) {
        const manager = res.data.manager
        user = manager.producer 
        isManager = true
      }
      else {
        user = res.data.user
        isManager = false
      }
      
      const form = {
        id: user.id,
        email: user.email,
        enderecoFazenda: user.farmAddress,
        nomeCompleto: user.name,
        telefone: user.phone,
        nomeFazenda: user.farmName,
        perfil: user.profile,
        isManager
      }

      await SecureStoragePlugin.set({key:'credentials', value: JSON.stringify({email: user.email, password})})
      await LocalDb.set('user', form);
      navigate('/splash-screen');
    } catch (err) {
      setError('Usuário ou senha inválidos');
      console.error(err)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
        {
        loading? <UiLoading/> : (
          error && <p className="error" style={{color: 'red'}}>{error}</p>
        )}
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default LoginPage;
