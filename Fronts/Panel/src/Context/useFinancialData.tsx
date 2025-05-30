import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FinancialClient } from './Typescript/FinancialTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

interface Props{
    client_id: string
}
function useFinancialData({client_id}:Props) {
    const [financialClientData, setFinancialClientData] = useState<FinancialClient>({
        movimientos: [],
        historial: []
    })
    const getFinancialClientData = useCallback(async(): Promise<boolean> => {

        const url = new URL(logic_apis.financial + "/get-financial-data")
        url.searchParams.append("client_id", client_id)
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            })

            const responseData = await response.json()

            if([404, 401].includes(response.status)){
                setFinancialClientData({
                    movimientos: [],
                    historial: [],
                })
                return false
            }
            if(!response.ok) throw new Error(responseData.msg || "Error desconocido")
            setFinancialClientData({
                movimientos: responseData.movimientos,
                historial: responseData.historial,
            })
        return true
        } catch (error) {
            console.log(error)
            setFinancialClientData({
                    movimientos: [],
                    historial: [],
                })
            if(error instanceof TypeError){
                showNotification({
                    color: "red",
                    styles: (theme) => ({
                        title:{color: "black"},
                        description: {color: "black"}
                    }),
                    title: "Error de conexión",
                    message: "Verifique su conexión a internet",
                    autoClose: 3500,
                    position: "top-right"
                })
                return false
            }else if(error instanceof SyntaxError) return false
            showNotification({
                color: "red",
                styles: (theme) => ({
                    title:{color: "black"},
                    description: {color: "black"}
                }),
                title: "Error",
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 3500,
                position: "top-right"
            })

            return false
        }
    },[client_id])
    return useMemo(() => ({
        financialClientData,
        setFinancialClientData,
        getFinancialClientData,
    }), [
        financialClientData,
        setFinancialClientData,
        getFinancialClientData,
    ])
}

export default useFinancialData
