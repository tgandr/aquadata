import { CardPayment, initMercadoPago, Payment, StatusScreen } from "@mercadopago/sdk-react";
import { useState, useEffect } from "react";
import LocalDb from '../databases/local.db'
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

const publicKey = "TEST-f8435a8f-634d-4bd6-8e1c-550fec25792a";
initMercadoPago(publicKey, {locale: 'pt-BR'})

const Payments = () => {
  const [credentials,setCredentials] = useState()
  const [paymentId, setPaymentId] = useState(null)

  useEffect(() => {
    SecureStoragePlugin.get({key: 'credentials'}).then(data => {
      const result = JSON.parse(data.value)
      setCredentials(result)
    })
  }, [])

  const initialization = {
      amount: 100
  };
  const customization = {
    visual: {
      texts: {
        formTitle: "Realizar assinatura: R$ 150"
      }
    },
    paymentMethods: {
      maxInstallments: 1
    },
  };
  const onSubmit = async (
  formData
  ) => {
  // callback chamado ao clicar no botão de submissão dos dados
  return new Promise((resolve, reject) => {
    console.log(formData)
    const auth = `${credentials.email}:${credentials.password}`
    fetch("http://localhost:5234/process_payment", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(auth)}`,
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
       
            
  return (
    <>
     {paymentId?
      (<StatusScreen
          initialization={{paymentId}}
          onReady={onReady}
          onError={onError}
        />) :
      (<CardPayment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
        />)
      }
    </>
  )
}

export default Payments