import { useRef, useState } from "react";
import './UiButton.css'
import UiLoading from "../UiLoading";

const UiButton = ({onClickAsync, children = "Button", className, type= "button"}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true)

    try {
      await onClickAsync()
    } 
    catch (error){
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  }
  return ( 
    <button
      onClick={handleClick}
      className={"ui-button "+className}
      disabled={loading}
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