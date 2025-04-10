import { initMercadoPago, Payment, StatusScreen } from "@mercadopago/sdk-react";
import { useState, useEffect } from "react";

const publicKey = "APP_USR-38ad1b2b-3a61-44c8-a444-e1bbd725a2a5";
initMercadoPago(publicKey, {locale: 'pt-BR'})

const Payments = () => {
    const [paymentId, setPaymentId] = useState(null)
    const initialization = {
        amount: 1
       };
       const customization = {
        paymentMethods: {
          bankTransfer: "all",
          creditCard: "all",
          prepaidCard: "all",
          debitCard: "all",
        },
       };
       const onSubmit = async (
        { selectedPaymentMethod, formData }
       ) => {
        // callback chamado ao clicar no botão de submissão dos dados
        return new Promise((resolve, reject) => {
          console.log(formData)
          fetch("http://localhost:5234/process_payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((response) => response.json())
            .then((response) => {
              console.log(response)
              setPaymentId(response.id)
              // setIsDone(true)
              resolve();
            })
            .catch((error) => {
              // lidar com a resposta de erro ao tentar criar o pagamento
              reject();
            });
        });
       };
       const onError = async (error) => {
        // callback chamado para todos os casos de erro do Brick
        console.log(error);
       };
       const onReady = async () => {
        /*
          Callback chamado quando o Brick estiver pronto.
          Aqui você pode ocultar loadings do seu site, por exemplo.
        */
       };
       
            

    return paymentId? <StatusScreen
      initialization={{paymentId}}
      onReady={onReady}
      onError={onError}
    /> :
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={onReady}
      onError={onError}
    />
}

export default Payments