import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/back_white.jpeg';
import { useEffect, useState } from 'react';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import initDb from '../databases/pouch.db';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    setFadeClass('fade-out');

    SecureStoragePlugin.get({key: 'credentials'}).then(res => {
      const credentials = JSON.parse(res.value)
      initDb(credentials.email, credentials.password).then(() => {
        navigate('/dashboard')
      })
    })
  })

  return ( 
    <div className={`home-page ${fadeClass}`}>
      <div className="content">
        <img src={logo} alt="AQUADATA Logo" className="logo" />
      </div>
      <footer>
        <p>Versão 1.0 | © 2024 AQUADATA</p>
      </footer>
    </div>
  );
}
 
export default SplashScreen;