import React, { useCallback, useMemo, useState } from 'react'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'
import { ExpirationClient } from './Typescript/ExpirationTypes'

function useExpirations() {
    const [token] = useState(localStorage.getItem("token") || "")
    const [expirations, setExpirations] = useState<ExpirationClient>({
        toOvercome: [],
        expired: []
    })

    const getExpirations = useCallback(async () => {
        const url = new URL(logic_apis.expirations + "/get-expirations")
        try {
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const responseData = await response.json()

            if(response.status === 404){
                setExpirations({
                    toOvercome:[],
                    expired: []
                })

                return true
            }
            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }

            setExpirations({
                toOvercome: responseData.toOvercome,
                expired: responseData.expired
            })

            return true
        } catch (error) {
            console.log(error)
            showNotification({
                color: "red",
                title: "Error al obtener los vencimientos",
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 5000,
                position: "top-right"
            })

            return false
        }
    }, [token])
    return useMemo(() => ({
        getExpirations, expirations
    }), [
        getExpirations, expirations
    ])
    
}

export default useExpirations
