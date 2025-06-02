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
  confirmOnly = false,
  danger = false
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
      setErrorMessage("Erro na requisição")
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
          <h3 style={{color: danger && '#dc3544'}}>{title}</h3>
          <p>{subTitle}</p>
          {showError && <p className='error'>{errorMessage}</p>}
          <div className="confirmation-buttons">
            <button 
              className={`${danger? 'btn-danger' : 'btn-cancel'}`}
              onClick={(e) => {closePopup(e)}}
            >{cancelButtonText}</button>
            {!confirmOnly && <UiButton onClickAsync={confirmPopup} color="#dc3544" outline={true}>{confirmButtonText}</UiButton>}
          </div>
        </div>
      </div>
   );
}
 
export default ConfirmationPopup;