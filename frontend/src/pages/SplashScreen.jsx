import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/back_white.jpeg';
import { useEffect, useState } from 'react';
import useDatabase from '../hooks/useDatabase';
const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeClass, setFadeClass] = useState('fade-in');
  const db = useDatabase()

  useEffect(() => {
    if (!db) return;
    setFadeClass('fade-out');
    db.allDocs().finally(() => {
      navigate('/dashboard')
    })
  },[db])

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