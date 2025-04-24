import React, { useCallback, useMemo, useState } from 'react'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

function useExpirations() {
    const [token] = useState(localStorage.getItem("token") || "")
    const getExpirations = useCallback(async () => {
        const url = new URL(logic_apis.expirations + "/get-expirations")
        try {
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }

            console.log(responseData)
        } catch (error) {
            console.log(error)
            showNotification({
                color: "red",
                title: "Error al obtener los vencimientos",
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 5000,
                position: "top-right"
            })
        }
    }, [token])
    return useMemo(() => {
        getExpirations
    }, [
        getExpirations
    ])
}

export default useExpirations
