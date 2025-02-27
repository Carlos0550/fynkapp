import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { logic_apis } from "../apis.js"
import { showNotification } from '@mantine/notifications'
import { FinancialClientData } from './Typescript/FinancialClientData.js'
import { useLocation } from 'react-router-dom'
function useDebts(setCuentaRegresivaIniciada:any, showSessionExpiredNotification:any) {
    const [token] = useState(localStorage.getItem("token") || "")
    const location = useLocation()
    const pathSegments = location.pathname.split("/")
    const clientID = pathSegments[pathSegments.length - 1]

    const [financialClientData, setFinancialClientData] = useState<FinancialClientData>({
        clientDebts: [],
        clientDelivers: []
    })

    const getFinancialClientData = useCallback(async () => {
        const attemptFetch = async (retries = 2) => {
            const url = new URL(logic_apis.clients + "/get-client-financial-data");
            url.searchParams.append("client_id", clientID || "");
    
            if (!clientID && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return attemptFetch(retries - 1);
            }
    
            try {
                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
    
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
            }
        };
    
        return await attemptFetch();
    }, [clientID, token]);
    

    const createDebt = useCallback(async (formValues: any, clientName: string):Promise<boolean>=>{
        const newUrl = new URL(logic_apis.clients + "/debts/create-debt")
        

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

  return useMemo(() => ({
    createDebt,
    getFinancialClientData,
    financialClientData
  }),[
    createDebt,
    getFinancialClientData,
    financialClientData
  ])
}

export default useDebts