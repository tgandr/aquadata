import { useEffect, useRef, useState } from 'react';
import '../styles/ConfirmationPopup.css';
import UiButton from '../ui/UiButton';

const ConfirmationPopup = ({
  isVisible = false, 
  onConfirm = () => {},
  onCancel = () => {},
  title = 'Title',
  subTitle = '',
  error = 'Erro ao confirmar',
  cancelButtonText = 'Voltar',
  confirmButtonText = 'Confirmar',
}) => {
  const modalRef = useRef(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error);

  function closePopup(e) {
    e.stopPropagation();
    onCancel();
  }

  async function confirmPopup() {
    try {
      await onConfirm();
    }
    catch (err){
      if (err instanceof TypeError) 
        setErrorMessage("Erro de conexão")
      setShowError(true);
    }
  }

  useEffect(() => {
    if (!modalRef.current) return;
    if (isVisible) {
      modalRef.current.classList.remove('hidden');
    } else {
      modalRef.current.classList.add('hidden');
    }
  }, [isVisible])

  return (
    <div 
        ref={modalRef}
        className="confirmation-popup hidden"
        onClick={(e) => {
          closePopup(e)
        }}
      >
        <div 
          className="confirmation-content"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>{title}</h3>
          <p>{subTitle}</p>
          {showError && <p className='error'>{errorMessage}</p>}
          <div className="confirmation-buttons">
            <button 
              className="btn-cancel"
              onClick={(e) => {closePopup(e)}}
            >{cancelButtonText}</button>
            <UiButton onClickAsync={confirmPopup}>{confirmButtonText}</UiButton>
          </div>
        </div>
      </div>
   );
}
 
export default ConfirmationPopup;