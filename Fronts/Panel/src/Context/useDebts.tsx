import React, { use, useCallback, useEffect, useMemo, useState } from 'react'
import { DebtForm, EditingData } from './Typescript/DebtsTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

interface Props {
    client_id: string,
    getAllClients: () => Promise<boolean>,
    business_id: string
}
function useDebts({
    client_id,
    getAllClients,
    business_id
}: Props) {
    const [editingDebt, setEditingDebt] = useState<EditingData | null>(null)
    const saveDebt = useCallback(async (debtData: DebtForm): Promise<boolean> => {
        const url = new URL(logic_apis.debts + "/save-debt")
        url.searchParams.append("client_id", client_id)
        url.searchParams.append("business_id", business_id)
        if (editingDebt?.debt_id) {
            url.searchParams.append("debt_id", editingDebt.debt_id)
            url.searchParams.append("editing", "true")
        }

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
            await getAllClients()
            return true
        } catch (error) {
            console.log(error)
            if (error instanceof SyntaxError) return false
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
    }, [client_id, getAllClients, editingDebt, business_id])

    const deleteDebt = useCallback(async (debt_id: string): Promise<boolean> => {
       
        const url = new URL(logic_apis.debts + "/delete-debt")
        url.searchParams.append("debt_id", debt_id || "")
        url.searchParams.append("client_id", client_id || "")

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            })
            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
            showNotification({
                color: "green",
                styles: (theme) => ({
                    title: { color: "black" },
                    description: { color: "black" }
                }),
                title: "Deuda eliminada",
                message: responseData.msg,
                autoClose: 3000,
                position: "top-right"
            })
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                color: "red",
                styles: (theme) => ({
                    title: { color: "black" },
                    description: { color: "black" }
                }),
                title: "Error al eliminar la deuda",
                message: error.message,
                autoClose: 5000,
                position: "top-right"
            })
            return false
        }
    }, [client_id, getAllClients])
    return useMemo(() => ({
        saveDebt, editingDebt, setEditingDebt, deleteDebt
    }), [
        saveDebt, editingDebt, setEditingDebt, deleteDebt
    ])
}

export default useDebts
