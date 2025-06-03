import React, { useCallback, useMemo } from 'react'
import { logic_apis } from '../apis'
import { ClientInterface } from './Typescript/ClientsTypes'
import { FinancialClient } from './Typescript/FinancialTypes'
import { showNotification } from '@mantine/notifications'

interface Props{
    clientData: ClientInterface,
    clientDelivers: FinancialClient["movimientos"],
    clientDebts: FinancialClient["movimientos"]
}
function useNotifications({clientData, clientDelivers, clientDebts}: Props) {
    const sendNotification = useCallback(async(): Promise<boolean> => {
        const url = new URL(logic_apis.notifications + "/send-notification")
        const token = localStorage.getItem("token")
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || ""}`
                },
                body: JSON.stringify({
                    clientData,
                    clientDebts: clientDebts.filter(c => c.estado_financiero === "activo" && c.tipo === "deuda"),
                    clientDelivers: clientDelivers.filter(c => c.estado_financiero === "activo" && c.tipo === "pago")
                })
            })

            if(!response.ok) throw new Error("Error al enviar la notificación")
            showNotification({
                color: "green",
                title: "Recordatorio enviado",
                message: "Se ha enviado un recordatorio al cliente.",
                autoClose: 3000,
                position: "top-right"
            })

            return true
        } catch (error) {
            console.error(error)
            showNotification({
                color: "red",
                title: "Error al enviar el recordatorio",
                message: "Ha ocurrido un error al enviar el recordatorio.",
                autoClose: 3000,
                position: "top-right"
            })
            return false
        }
    },[clientData, clientDelivers, clientDebts])

    return useMemo(() => ({
        sendNotification
    }), [
        sendNotification
    ])
}

export default useNotifications
