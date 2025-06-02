import { useEffect, useRef, useState } from 'react';
import '../styles/ConfirmationPopup.css';
const GenericPopup = ({
  isVisible = false,
  children = '',
  onCancel = () => {},
}) => {
  const modalRef = useRef(null);

  function closePopup(e) {
    e.stopPropagation();
    onCancel();
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
          {children}
        </div>
      </div>
   );
}
 
export default GenericPopup;