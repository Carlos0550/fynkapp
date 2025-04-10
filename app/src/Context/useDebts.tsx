import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { logic_apis } from "../apis.js"
import { showNotification } from '@mantine/notifications'
import { EditDebtHookInterface, FinancialClientData } from './Typescript/FinancialClientData.js'
import { ClientsForDebtsInterface } from './Typescript/DebtsTypes.js'
import { useSearchParams } from 'react-router-dom'
function useDebts(setCuentaRegresivaIniciada:any, showSessionExpiredNotification:any) {
    const [token] = useState(localStorage.getItem("token") || "")
    const [searchParams] = useSearchParams()
    const clientID = searchParams.get("clientID")

    const [financialClientData, setFinancialClientData] = useState<FinancialClientData>({
        clientDebts: [],
        clientDelivers: [],
        totalDebtAmount: 0
    }) 
    
    const [editDebtHook, setEditDebtHook] = useState<EditDebtHookInterface>({
        editingDebt: false,
        debtID: "",
        debtData: {
            debt_id: "",
            debt_products: [],
            debt_date: ""
        }
    })

    const [gettingClientData, setGettingClientData] = useState<boolean>(false)
    const getFinancialClientData = useCallback(async () => {
        const attemptFetch = async (retries = 2) => {
            const url = new URL(logic_apis.clients + "/get-client-financial-data");
            url.searchParams.append("client_id", clientID || "");
            if (!clientID && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return attemptFetch(retries - 1);
            }
    
            try {
                setGettingClientData(true)
                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if(response.status === 404){
                    showNotification({
                        title: "El cliente no tiene deudas.",
                        message: "No se encontraron deudas relacionadas a este cliente.",
                        color: "yellow",
                        autoClose: 3000,
                        position: "top-right"
                    })
                    return setFinancialClientData({
                        clientDebts: [],
                        clientDelivers: [],
                        totalDebtAmount: 0,
                        totalDeliverAmount: 0
                    })
                }
                if (response.status === 401) {
                    setCuentaRegresivaIniciada(true);
                    showSessionExpiredNotification();
                    return;
                }
    
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.msg || "Error desconocido");
                }
                setFinancialClientData(responseData);
                return true;
            } catch (error) {
                console.log(error);
                showNotification({
                    title: "Error al obtener los datos financieros",
                    message: error.message,
                    color: "red",
                    autoClose: 5000,
                    position: "top-right"
                });
                return false;
            }finally{
                setGettingClientData(false)
            }
        };
    
        return await attemptFetch();
    }, [clientID]);
    

    const createDebt = useCallback(async (formValues: any, clientName: string):Promise<boolean>=>{
        const newUrl = new URL(logic_apis.debts + "/create-debt")
        

        try {
            const response = await fetch(newUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formValues
            })

            if(response.status === 401){
                setCuentaRegresivaIniciada(true)
                showSessionExpiredNotification()
            }

            const responseData = await response.json()
            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }

             showNotification({
                title: "Deuda creada",
                message: "Deuda creada en la cuenta de " + clientName,
                color: "green",
                autoClose: 4000,
                position: "top-right"
            })
            getFinancialClientData()
            return true
        } catch (error) {
            console.log(error)
             showNotification({
                title: "Error al crear la deuda",
                message: error.message,
                color: "red",
                autoClose: 2000,
                position: "top-right"
            })
            return false
        }
    },[getFinancialClientData])

    const editDebts = useCallback(async(formValues: any) => {
        const url = new URL(logic_apis.debts + "/edit-debt")
        url.searchParams.append("debtID", editDebtHook.debtID || "")
        try {
            const response = await fetch(url,{
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formValues
            })

            if(response.status === 401){
                setCuentaRegresivaIniciada(true)
                showSessionExpiredNotification()
            }

            const responseData = await response.json()
            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }

            showNotification({
                title: "Deuda editada",
                message: "",
                color: "green",
                autoClose: 2000,
                position: "top-right"
            })

            getFinancialClientData()
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error al editar la deuda",
                message: error.message,
                color: "red",
                autoClose: 5000,
                position: "top-right",
                
            })

            return false
        }
    },[getFinancialClientData, editDebtHook])

    const deleteDebt = useCallback(async(debtID: string) => {
        const url = new URL(logic_apis.debts + "/delete-debt")
        url.searchParams.append("debtID", debtID || "")
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if(response.status === 401){
                setCuentaRegresivaIniciada(true)
                showSessionExpiredNotification()
            }

            const responseData = await response.json()
            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }

            showNotification({
                title: "Deuda eliminada",
                message: "",
                color: "green",
                autoClose: 2000,
                position: "top-right"
            })

            getFinancialClientData()
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error al eliminar la deuda",
                message: error.message,
                color: "red",
                autoClose: 5000,
                position: "top-right"
            })
            return false
        }
    },[getFinancialClientData])

    const [clientsForDebts, setClientsForDebts] = useState<ClientsForDebtsInterface []>([])
    const findClientsForDebts = useCallback(async (searchValue: string) => {
        const url = new URL(logic_apis.debts + "/find-client-for-debts")
        url.searchParams.append("search", searchValue || "")
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          const responseData = await response.json()
          if(response.status === 404){
            setClientsForDebts([])
          }
          if(!response.ok) throw new Error(responseData.msg || "Error desconocido")
        
          setClientsForDebts(responseData.client_result)
        } catch (error) {
          console.log(error)
          showNotification({
            title: "Error al buscar clientes",
            message: error.message,
            color: "red",
            autoClose: 3000,
            position: "top-right"
          })
        }
      }, [token])

      const cancelDebt = useCallback(async () => {
        const url = new URL(logic_apis.debts + "/cancel-debt")
        url.searchParams.append("clientID", clientID || "")
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          const responseData = await response.json()
          if(!response.ok) throw new Error(responseData.msg || "Error desconocido")
          showNotification({
            title: "Deuda cancelada",
            message: responseData.msg,
            color: "green",
            autoClose: 3000,
            position: "top-right"
          })
          getFinancialClientData()
          return true
        } catch (error) {
          console.log(error)
          showNotification({
            title: "Error al cancelar la deuda",
            message: error.message,
            color: "red",
            autoClose: 3000,
            position: "top-right"
          })

          return false
        }
      },[clientID])

  return useMemo(() => ({
    createDebt,
    getFinancialClientData,
    financialClientData,
    editDebtHook, setEditDebtHook,
    editDebts, deleteDebt,
    clientsForDebts, findClientsForDebts,
    cancelDebt, gettingClientData
  }),[
    createDebt,
    getFinancialClientData,
    financialClientData,
    editDebtHook, setEditDebtHook,
    editDebts, deleteDebt,
    clientsForDebts, findClientsForDebts,
    cancelDebt, gettingClientData
  ])
}

export default useDebts