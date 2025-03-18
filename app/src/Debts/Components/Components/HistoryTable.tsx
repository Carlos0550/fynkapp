import { showNotification } from '@mantine/notifications';
import React, { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { logic_apis } from '../../../apis';
import { ClientDebt } from '../../../Context/Typescript/FinancialClientData';

interface ClientHistory {
    clientID: string;
    debt_date: Date;
    debts_amount: string;
    delivers_amount: string;
    
}

function HistoryTable() {
    const [searchParams] = useSearchParams();
    const clientID = searchParams.get('clientID');
    // const clientHistory =

    const getHistoryClient = useCallback(async()=> {
        if (!clientID) return showNotification({ title: "Error", message: "El ID del cliente no es válido", color: "red", position: "top-right", autoClose: false });
        const token = localStorage.getItem("token");
        if (!token) return showNotification({ title: "Error", message: "No se pudo obtener el historial del cliente", color: "red", position: "top-right", autoClose: false });
        try {
            const url = new URL(logic_apis.debts + "/get-history-client")
            url.searchParams.append("clientID", clientID)
            const result = await fetch(url,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await result.json()
            console.log(data)
        } catch (error) {
            showNotification({ title: "Error", message: "No se pudo obtener el historial del cliente", color: "red", position: "top-right", autoClose: false })
        }

    },[clientID])

    const alreadyFetched = useRef(false)
    useEffect(()=>{
        if(clientID && !alreadyFetched.current) {
            getHistoryClient()
            alreadyFetched.current = true
        }
    },[getHistoryClient, clientID])
  return (
    <div>HistoryTable</div>
  )
}

export default HistoryTable