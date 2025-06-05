import { useCallback, useMemo } from 'react'
import { logic_apis } from '../apis'

import { showNotification } from '@mantine/notifications'

function useNotifications() {
    const sendNotification = useCallback(async(client_id: string): Promise<boolean> => {
        const url = new URL(logic_apis.notifications + "/send-notification")
        url.searchParams.append("client_id", client_id)
        const token = localStorage.getItem("token")
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || ""}`
                }
            })

            const responseData = await response.json()
            if(!response.ok) throw new Error(responseData.msg || "Error al enviar la notificación")
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
                title: error.message,
                message: "",
                autoClose: 5000,
                position: "top-right"
            })
            return false
        }
    },[])

    return useMemo(() => ({
        sendNotification
    }), [
        sendNotification
    ])
}

export default useNotifications
