import { IconContainer } from "./utils";
import UiButton from '../ui/UiButton'
import '../styles/AddManager.css'
import GenericPopup from "./GenericPopup";
import { useEffect, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmationPopup from '../pages/ConfirmationPopup'
import apiRequest from '../services/apiRequest'
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import useDatabase from '../hooks/useDatabase'

const AddManagerPage = () => {
  const db = useDatabase()
  const [manager, setManager] = useState()
  const [credentials, setCredentials] = useState();
  const [form,setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showRegisterPage, setShowRegisterPage] = useState(true)
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('')
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  useEffect(() => {
    if (!db) return
    db.find({
      selector: {
        dataType: 'manager'
      }
    }).then(res => {
      const data = res.docs[0]
      if (data) {
        setManager(data)
        setShowRegisterPage(false)
      }
    })
  }, [db])

  useEffect(() => {
    if (credentials) return;
    SecureStoragePlugin.get({key: 'credentials'}).then(data => {
      const result = JSON.parse(data.value)
      setCredentials(result)
    })    
  }, [])

  useEffect(() => {
    if (!form.phone || !form.name || !form.password || !form.confirmPassword)
      setIsDisable(true)
  })

  useEffect(() => {
    if (!form.password || !form.confirmPassword)
      return;

    if (form.confirmPassword === form.password) {
      setIsDisable(false);
      setShowError(false);
    } else {
      setIsDisable(true);
      setShowError(true);
    }
    setErrorMessage('Senhas não coincidem')
  }, [form.password, form.confirmPassword])

  useEffect(() => {
    if (!form.phone) return
    if (!form.phone.match(/^[1-9]{2}9\d{8}$/)) {
      setErrorMessage("Formato inválido de telefone")
      setIsDisable(true)
      setShowError(true)
    } else {
      setShowError(false)
      setIsDisable(false)
    }
  }, [form.phone])

  function handleChangeForm(e) {
    const {value, name} = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  async function saveManager() {
    const res = await apiRequest(
      'users/add-manager',
      'POST',
      {
        name: form.name,
        phone: form.phone,
        password: form.password
      },
      {
        email: credentials.email,
        password: credentials.password
      }
    )

    setManager(res)
    showPopup(false)
    setShowRegisterPage(false)
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
                <div className="manager-data">
                  {manager.name}
                </div>
                <div >
                  {manager.phone}
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
              <input type="text" value={form.name} name="name" onChange={handleChangeForm}/>
            </div>
            <div className="popup-item">
              <div>Telefone</div>
              <input type="tel" value={form.phone}
                placeholder="88912345678"
                name="phone"
                onChange={handleChangeForm} 
                required
              />
            </div>
            <div className="popup-item">
              <div>Senha</div>
              <input type="password" value={form.password} name="password" onChange={handleChangeForm}/>
            </div>
            <div className="popup-item">
              <div>Confirmar <br/>senha</div>
              <input type="password" value={form.confirmPassword} name="confirmPassword"onChange={handleChangeForm}/>
            </div>
            {showError && <p style={{color: 'red'}}>{errorMessage}</p>}
            <UiButton disabled={isDisable} type="submit" onClickAsync={saveManager}>Salvar</UiButton>
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