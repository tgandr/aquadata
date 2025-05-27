import "../styles/profilePage.css"
import { useEffect, useState } from "react";
import LocalDb from "../databases/local.db";
import UiLoading from "../ui/UiLoading";
import ConfirmationPopup from "./ConfirmationPopup";
import { IconContainer } from "./utils";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import useSubscription from "../hooks/useSubscription";

const profilePage = () => {
  const [user, setUser] = useState();
  const [subscription, setSubscription] = useState();
  const [isLoaded, setIsLoaded] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (user) return;
    const userPromise = LocalDb.get('user')
    const subscriptionPromise = useSubscription()

    Promise.all([userPromise, subscriptionPromise]).then(values => {
      const [user, subscription] = values;
      setUser(user)
      setSubscription(subscription)
      setIsLoaded(true)
    })
  }, [])

  async function handleCancelSubscription() {
    // if (!subscription.isActive) return;    
    await subscription.cancelSubscription()
    setShowConfirmation(false);
    window.location.reload();
  }

  if (!isLoaded) return (
    <div className="loading-container">
      <UiLoading size={45}/>
    </div>
  )

  return (
    <div>
      <header className="">
        <div className="identify-data">
          <h2>{user.nomeCompleto}</h2>
        </div>
      </header>

      <section className="page-data">
        <h3 className="title">Dados</h3>
        <div>
          <div className="data-item">
            <div className="data-label">Email:</div>
            <div className="data-value">{user.email}</div>
          </div>
          <div className="data-item">
            <div className="data-label">Perfil:</div>
            <div className="data-value">{user.perfil}</div>
          </div>
          <div className="data-item">
            <div className="data-label">Telefone:</div>
            <div className="data-value">{user.telefone}</div>
          </div>
          <div className="data-item">
            <div className="data-label">Fazenda:</div>
            <div className="data-value">{user.nomeFazenda}</div>
          </div>
          <div className="data-item">
            <div className="data-label">Endereço:</div>
            <div className="data-value">{user.enderecoFazenda}</div>
          </div>
        </div>

        <div className="subscription-data">
          <h3 className="title">Assinatura</h3>
          <div className="subscription">
            <div className="subscription-label">Status:</div>
            <div className="subscription-value status">
              <span className="status-circle"
                style={{
                  backgroundColor: subscription.isActive ? '#62b60f' : '#FF0000'
                }}
              ></span>
              {subscription.isActive ? 'Ativa' : 'Cancelada'}
            </div>
            <div className="subscription-label">Vencimento:</div>
            <div className="subscription-value">
              {new Date(subscription.expirationDate).toLocaleDateString('pt-BR')}
            </div>
          </div>
          {subscription.isActive && <div 
            className="subscription-btn"
            onClick={() => setShowConfirmation(true)}
          >
            Cancelar Assinatura
          </div>}
        </div>
        <IconContainer/>
      </section>

      <ConfirmationPopup
        isVisible={showConfirmation}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleCancelSubscription}
        title="Tem certeza que deseja cancelar sua assinatura?"
        subTitle="Você perderá acesso a parte das funcionalidades do aplicativo."
        error="Erro ao cancelar assinatura"
      />
    </div>
  );
}
 
export default profilePage;