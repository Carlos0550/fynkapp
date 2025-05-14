import React, { useEffect, useState } from "react"
import { logic_apis } from "../../../../../../apis";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
interface ClientDataInterface{
  client_id : string,
  client_name: string,
  total: number
}
function useClientPayments(
  closeModal: () => void
) {

  const [step, setStep] = useState(1) 


  const [searchValue, setSearchValue] = useState("")
  const [searching, setSearching] = useState(false);
  const [clientData, setClientData] = useState<ClientDataInterface>({
    client_id: "",
    client_name: "",
    total: 0
  })

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const navigate = useNavigate()

  const handleSearchClient = async () => {
    try {
      setSearching(true);
      const url = new URL(logic_apis.fast_actions + "/retrieve-client-data")
      const token = localStorage.getItem("token")
      url.searchParams.append("client_dni", searchValue)
      const response = await fetch(url,{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const responseData = await response.json()
      if(response.status === 404){
        return showNotification({
          color: "red",
          title: "Cliente no encontrado",
          message: responseData.message,
          autoClose: 2500,
          position: "top-right"
        });
      }

      if(!response.ok) throw new Error(responseData.message || "Error desconocido")
      setStep(2)
      const clientData = responseData.clientData
      
      setClientData(clientData)
    } catch (error) {
      console.log(error)
      showNotification({
        color: "red",
        title: "Error",
        message: error instanceof Error ? error.message : "Error desconocido",
        autoClose: 4500,
        position: "top-right"
      });
      return;
    }finally{
      setSearching(false);
    }
  }

  const [sendingPayment, setSendingPayment] = useState(false)
  const registerPayment = async (paymentAmount: number) => {
    if(!paymentAmount || isNaN(paymentAmount)) return;
    if(paymentAmount > clientData.total) return showNotification({
      color: "red",
      title: "Error",
      message: "El monto ingresado es mayor al total de la deuda",
      autoClose: 4500,
      position: "top-right"
    });

    const url = new URL(logic_apis.fast_actions + "/save-deliver")
    const token = localStorage.getItem("token")
    url.searchParams.append("client_id", clientData.client_id)
    url.searchParams.append("payment_amount", paymentAmount.toString())
    try {
      setSendingPayment(true)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const responseData = await response.json()
      if(!response.ok) throw new Error(responseData.message || "Error desconocido")
      showNotification({
        color: "green",
        title: `Pago registrado, nuevo saldo ${parseFloat(clientData.total - paymentAmount).toLocaleString("es-AR",{style: "currency", currency: "ARS"})}`,
        message: responseData.message,
        autoClose: 7500,
        position: "top-right"
      });

      showNotification({
        color: "blue",
        title: "Un momento...",
        message: "Redirigiendo a la cuenta corriente del cliente.",
        autoClose: 2500,
        position: "top-right"
      })
      setTimeout(() => {
        setClientData({
          client_id: "",
          client_name: "",
          total: 0
        })
        setStep(1)
        
        closeModal()
      }, 1000);
    } catch (error) {
      console.log(error)
      showNotification({
        color: "red",
        title: "Error",
        message: error instanceof Error ? error.message : "Error desconocido",
        autoClose: 4500,
        position: "top-right"
      });
      return;
    }finally{
      setTimeout(() => {
        setSendingPayment(false)
      }, 1000);
    }
  }
  
  useEffect(() => {
    const handler = setTimeout(() => {
      const dniRegex = /^\d{8,9}$/;
      if(!searchValue || !dniRegex.test(searchValue)) return
      handleSearchClient()
    }, 500); 
  
    return () => {
      clearTimeout(handler); 
    };
  }, [searchValue]);

  return {
    step, setStep, handleSearchValueChange,
    searchValue, setSearchValue, searching,
    setClientData, clientData, handleSearchClient,
    registerPayment, sendingPayment
    
  }
}

export default useClientPayments