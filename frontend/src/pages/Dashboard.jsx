import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aquaDataIcon from '../assets/images/aqua-data-icon-512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShrimp, faWarehouse, faDollarSign, faSignOutAlt, faClipboardList, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import UiButton from '../ui/UiButton';
import '../styles/Dashboard.css';
import { Preferences } from '@capacitor/preferences';
import LocalDb from '../databases/local.db';
import { Browser } from '@capacitor/browser';
import  apiRequest  from '../services/apiRequest';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import UiLoading from '../ui/UiLoading';
import ConfirmationPopup from './ConfirmationPopup';
import useSubscription from '../hooks/useSubscription';

const Dashboard = () => {
  const [formData, setFormData] = useState({});
  const [subscription, setSubscription] = useState({});
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [credentials, setCredentials] = useState()
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const getFormData = LocalDb.get('user');
    const getCredentials = SecureStoragePlugin.get({key: 'credentials'})
    const getSubscription = useSubscription();

    Promise.all([getFormData, getCredentials, getSubscription]).then(values => {
      const [formData, credentialsJson, subscription] = values
      const credentials = JSON.parse(credentialsJson.value)
      setCredentials(credentials)
      setFormData(formData)
      setSubscription(subscription)
      setIsLoaded(true)
    })
    if (formData.eraseLocalStorageAfterLogout) {
      const handleUnload = () => {
        Preferences.clear()
      };
      
      window.addEventListener('beforeunload', handleUnload);

      return () => {
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
  }, []);

  const handleLogoutClick = () => {
    const isConfirmed = window.confirm('Você tem certeza que deseja sair?');
    if (isConfirmed) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    LocalDb.clear();
    SecureStoragePlugin.clear()
    navigate('/login');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '5585992612616';
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank');
  };

  const handleSubscriptionClick = async () => {
    const response = await apiRequest(
      'process_payment', 
      'POST', 
      {payer_email: formData.email},
      {email: credentials.email, password: credentials.password}
    )
    await Browser.open({
      url: response.initPoint
    })
  }

  return (
    isLoaded?
    (<div className="dashboard-container">
      <div className="identify-data">
        <h2>Fazenda {formData.nomeFazenda}</h2>
      </div>
      <div className="main">
        {!subscription.isActive && 
        <div className="subscription-alert">
          <span>
            Sua conta está em modo de teste <br/>
            Ative sua assinatura para liberar todos os recursos
          </span>
          <UiButton 
            className="subscription-button"
            onClickAsync={() => setShowConfirmationPopup(true)}
          >
            Assine agora
          </UiButton>
        </div>}
        <div className="btn-container">
          <button className="dashboard-button" onClick={() => navigate('/viveiros')}>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faShrimp} className="icon-btn" />
            </div>
            <div className="text-wrapper">
              <span>Viveiros</span>
            </div>
          </button>
          <button className="dashboard-button" onClick={() => navigate('/financeiro')}>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faDollarSign} className="icon-btn" />
            </div>
            <div className="text-wrapper">
              <span>Financeiro</span>
            </div>
          </button>
          <button className="dashboard-button" onClick={() => navigate('/estoque')}>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faWarehouse} className="icon-btn" />
            </div>
            <div className="text-wrapper">
              <span>Estoque</span>
            </div>
          </button>
          <button className="dashboard-button" onClick={() => navigate('/inventario')}>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faClipboardList} className="icon-btn" />
            </div>
            <div className="text-wrapper">
              <span>Inventário</span>
            </div>
          </button>
          <button className="dashboard-button" onClick={() => navigate('/registrar-gerente')}>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faUsers} className="icon-btn" />
            </div>
            <div className="text-wrapper">
              <span>Usuários</span>
            </div>
          </button>
          <button className="dashboard-button" onClick={() => navigate('/profile')}>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faUser} className="icon-btn" />
            </div>
            <div className="text-wrapper">
              <span>Meu Perfil</span>
            </div>
          </button>
        </div>
        <div className="medias">
          <a href="https://www.instagram.com/data.aqua"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <FontAwesomeIcon icon={faInstagram} /><span> data.aqua</span>
          </a>
        </div>
      </div>
      <div className="icon-container">
        <div className="icon-container-inner">
          <button className="side-icon-button" onClick={handleWhatsAppClick}>
            <div>
              <FontAwesomeIcon icon={faWhatsapp} className="icon" />
            </div>
          </button>
          <img
            src={aquaDataIcon}
            alt="Aqua Data Icon"
            onClick={() => navigate('/dashboard')}
            className="centered-image"
          />
          <button className="side-icon-button" onClick={handleLogoutClick}>
            <div>
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
            </div>
          </button>
        </div>
      </div>
      <ConfirmationPopup
        isVisible={showConfirmationPopup}
        onCancel={() => setShowConfirmationPopup(false)}
        onConfirm={handleSubscriptionClick}
        title="Atenção"
        subTitle='Você será redirecionado para a página do Mercado Pago, onde poderá realizar o pagamento da sua assinatura.'
        cancelButtonText='Cancelar'
        confirmButtonText='Continuar'
      />

    </div>) :
    (<div className='loading-page'>
      <UiLoading size={45}/>
      </div>)
  );
};

export default Dashboard;
