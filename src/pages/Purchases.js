import React, { useState } from 'react';
import RationPurchasesPopup from './RationPurchasesPopup';

const Purchases = ({ setShowPurchasesPopup }) => {
    const [showRationPurchasesPopup, setShowRationPurchasesPopup] = useState(false);


    return (
        <div>
            <div className="popup">
                <div className="popup-inner">
                <h3>Compras</h3>
                    <button onClick={() => setShowRationPurchasesPopup(true)}>Ração</button>
                    <button>Probióticos</button>
                    <button>Fertilizantes</button>
                    <button>Outros</button>
                    <button onClick={() => setShowPurchasesPopup(false)}>Voltar</button>
                </div>
            </div>
            {showRationPurchasesPopup && 
                <RationPurchasesPopup setShowRationPurchasesPopup={setShowRationPurchasesPopup}/> }
        </div>
    )

}

export default Purchases;