import { useEffect, useRef, useState } from "react";
import './UiButton.css'
import UiLoading from "../UiLoading";

const UiButton = ({onClickAsync = () => {}, children = "Button", className = '', type= "button", 
disabled = false
}) => {
  const buttonRef = useRef(null)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!buttonRef.current) return
    
    if (disabled) 
      buttonRef.current.classList.add('ui-button--disabled')
    else 
      buttonRef.current.classList.remove('ui-button--disabled') 
  },[disabled])

  const handleClick = async (e) => {
    e.preventDefault()
    setLoading(true);

    try {
      await onClickAsync();
    } finally {
      setLoading(false)
    }
  }

  return ( 
    <button
      ref={buttonRef}
      onClick={handleClick} 
      className={'ui-button '+className}
      disabled={loading || disabled}
      type={type}
    >
      {loading && (
        <div className="loading-svg">
          <UiLoading/>
        </div>
      )}
        <span
          style={{visibility: loading? 'hidden' : 'visible'}}
        >
          {children}
        </span> 
    </button>
   );
}
 
export default UiButton;