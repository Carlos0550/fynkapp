import { useCallback, useMemo, useState } from 'react'
import { logic_apis } from "../apis"
import { ClientInterface, FormClient } from './Typescript/ClientsTypes'
import { showNotification } from '@mantine/notifications'
function useClients() {
    const [clients, setClients] = useState<ClientInterface[]>([])
    const getAllClients = useCallback(async(): Promise<boolean> => {
        const url = new URL(logic_apis.clients + "/get-all-clients")
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            })
            const responseData = await response.json()
            if([404, 401].includes(response.status)) return false
            if(!response.ok) throw new Error(responseData.msg || "Error desconocido")
            setClients(responseData)
            return true
        } catch (error) {
            console.log(error)
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
            }

            showNotification({
                color: "red",
                title: "Error al obtener los clientes",
                styles: (theme) => ({
                    title:{color: "black"},
                    description: {color: "black"}
                }),
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 3500,
                position: "top-right"
            })
            return false
        }
    },[])

    const saveClient = useCallback(async (formData: FormClient): Promise<boolean> => {
        const url = new URL(logic_apis.clients + "/save-client")
        try {
            const result = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify(formData)
            });

            const responseData = await result.json()
            if (!result.ok) throw new Error(responseData.msg || "Error desconocido")
            return true
        } catch (error) {
            console.log(error)
            if (error instanceof TypeError) return false

            showNotification({
                color: "red",
                title: "Error al guardar el cliente",
                styles: (theme) => ({
                    title:{color: "black"},
                    description: {color: "black"}
                }),
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 3500,
                position: "top-right"
            })
            return false
        }
    }, [])
    return useMemo(() => ({
        saveClient, clients, getAllClients
    }), [
        saveClient, clients, getAllClients
    ])
}

export default useClients
