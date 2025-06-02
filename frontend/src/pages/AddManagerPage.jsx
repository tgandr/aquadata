import { IconContainer } from "./utils";
import UiButton from '../ui/UiButton'
import '../styles/AddManager.css'
import GenericPopup from "./GenericPopup";
import { useEffect, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmationPopup from '../pages/ConfirmationPopup'

const AddManagerPage = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showRegisterPage, setShowRegisterPage] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('')
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  useEffect(() => {
    if (!phone || !name || !password || !confirmPassword)
      setIsDisable(true)
  })

  useEffect(() => {
    if (!password || !confirmPassword)
      return;

    if (confirmPassword === password) {
      setIsDisable(false);
      setShowError(false);
    } else {
      setIsDisable(true);
      setShowError(true);
    }
    setErrorMessage('Senhas não coincidem')
  }, [password, confirmPassword])

  useEffect(() => {
    if (!phone) return
    if (!phone.match(/^[1-9]{2}9\d{8}$/)) {
      setErrorMessage("Formato inválido de telefone")
      setIsDisable(true)
      setShowError(true)
    } else {
      setShowError(false)
      setIsDisable(false)
    }
  }, [phone])

  function handleChangePhone(e) {
    setPhone(e.target.value)
  }

  function handleChangePassword(e) {
    setPassword(e.target.value)
  }

  function handleChangeConfirmPassword(e) {
    setConfirmPassword(e.target.value)
  }

  function handleChangeName(e) {
    setName(e.target.value)
  }

  return ( 
    <div className="manager-container">
      <header className="">
        <div className="identify-data">
          <h2>Usuários</h2>
        </div>
      </header>

      <section className="page-data">
        {
          showRegisterPage ? 
          <div>
            <div className="page-content">
              <p>Você não possui nenhum gerente de campo cadastrado. Cadastre-o informando o telefone do gerente e uma senha de sua preferência. Essas credenciais servirão para que ele possa entrar no aplicativo.</p>
              <p>Obs: O gerente de campo pode somente criar e gerenciar cultivos, além de visualizar o estoque.</p>
            </div>
            <UiButton onClickAsync={() => setShowPopup(true)}>Cadastrar</UiButton>
          </div> 
          :
          <div className="page-content">
              <h3>Gerentes Cadastrados</h3>
              <div className="manager-item">
                <div>
                  Carlos 
                </div>
                <div>
                  88 912345678
                </div>
                <div className="icons">
                  <FontAwesomeIcon icon={faEdit} onClick={() => setShowPopup(true)} className="manager-icon"/>
                  <FontAwesomeIcon icon={faTrash} onClick={() => setShowConfirmPopup(true)} className="manager-icon"/>
                </div>
              </div>
          </div>
        }
      </section>
      <IconContainer/>
      
      <div className="popup-bucket">
        <GenericPopup isVisible={showPopup}>
          <form className="manager-popup">
            <h3>Cadastrar Gerente</h3>
            <div className="popup-item">
              <div>Nome</div>
              <input type="text" value={name} onChange={handleChangeName}/>
            </div>
            <div className="popup-item">
              <div>Telefone</div>
              <input type="tel" value={phone}
                placeholder="88912345678"
                onChange={handleChangePhone} 
                required
              />
            </div>
            <div className="popup-item">
              <div>Senha</div>
              <input type="password" value={password} onChange={handleChangePassword}/>
            </div>
            <div className="popup-item">
              <div>Confirmar <br/>senha</div>
              <input type="password" value={confirmPassword} onChange={handleChangeConfirmPassword}/>
            </div>
            {showError && <p style={{color: 'red'}}>{errorMessage}</p>}
            <UiButton disabled={isDisable} type="submit">Salvar</UiButton>
            <div className="cancel-btn" onClick={() => setShowPopup(false)}>Cancelar</div>
          </form>
        </GenericPopup>

        <ConfirmationPopup 
          isVisible={showConfirmPopup}
          title="Tem certeza?"
          onCancel={() => setShowConfirmPopup(false)}
        />
      </div>
    </div> 
  );
}
 
export default AddManagerPage;