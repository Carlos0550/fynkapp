import React, { useCallback, useMemo } from 'react'
import { DebtForm } from './Typescript/DebtsTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

interface Props {
    client_id: string,
}
function useDebts({
    client_id,
}: Props) {
    const saveDebt = useCallback(async (debtData: DebtForm): Promise<boolean> => {
        const url = new URL(logic_apis.debts + "/save-debt")
        url.searchParams.append("client_id", client_id)
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify(debtData)
            })
            const responseData = await response.json()
            if ([404, 401].includes(response.status)) return false
            if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
            return true
        } catch (error) {
            console.log(error)
            if(error instanceof SyntaxError) return false
            if (error instanceof TypeError) {
                showNotification({
                    color: "red",
                    styles: (theme) => ({
                        title: { color: "black" },
                        description: { color: "black" }
                    }),
                    title: "Error de conexión",
                    message: "Verifique su conexión a internet",
                    autoClose: 3500,
                    position: "top-right"
                })
                return false
            }

            showNotification({
                color: "red",
                styles: (theme) => ({
                    title: { color: "black" },
                    description: { color: "black" }
                }),
                title: "Error desconocido",
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 3500,
                position: "top-right"
            })
            return false
        }
    }, [client_id])
    return useMemo(() => ({
        saveDebt
    }), [
        saveDebt
    ])
}

export default useDebts
