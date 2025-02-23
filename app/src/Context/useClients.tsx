import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClientsInterface } from "./Typescript/ClientsTypes"
import { logic_apis } from "../apis"

import { showNotification } from "@mantine/notifications"
import { useAppContext } from "./AppContext"

function useClients(verifyToken, loginData) {
    const [clients, setClients] = useState<ClientsInterface[]>([])
    const [token] = useState(localStorage.getItem("token") || "")

    const getClient = useCallback(async (searchQuery?: any) => {
        if(!token) return;
        await verifyToken()
        const url = new URL(logic_apis.clients + "/get-clients")
        url.searchParams.append("searchQuery", searchQuery || "")

        try {
            const response = await fetch(url,{
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const responseData = await response.json()

            if (response.status === 401) {
                return showNotification({
                    title: "Sesión no válida",
                    message: "Tu sesión acaba de expirar. Por favor, inicia sesión nuevamente.",
                    color: "red",
                    autoClose: 4000,
                    position: "top-right"
                })
            }

            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }
            showNotification({
                title: searchQuery ? "Cliente/s encontrado/s" : "Lista de clientes actualizada",
                message: "",
                color: "blue",
                autoClose: 2000,
                position: "top-right"
            })

            setClients(responseData.clients)

            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: searchQuery ? "Error al buscar el cliente" : "Error al actualizar la lista de clientes",
                message: error.message,
                color: "red",
                autoClose: 4000,
                position: "top-right"
            })
            return false
        }

    }, [])

    const createClient = useCallback(async (clientData) => {
        const url = new URL(logic_apis.clients + "/create-client")

        try {

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(clientData)
            })

            if (response.status === 401) {
                showNotification({
                    title: "Sesión no válida",
                    message: "Tu sesión acaba de expirar. Por favor, inicia sesión nuevamente.",
                    color: "red",
                    autoClose: 4000,
                    position: "top-right"
                })
            }


            const responseData = await response.json()
            if (responseData?.msg === "No se encontraron clientes.") setClients([])
            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }

            getClient()
            showNotification({
                title: "Cliente guardado exitosamente",
                message: "",
                color: "green",
                autoClose: 2000,
                position: "top-right",
            })
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error al crear el cliente",
                message: error.message,
                color: "yellow",
                autoClose: 4000,
                position: "top-right"
            })
            return false
        }
    }, [getClient])


    const hasFetched = useRef(false); 
    useEffect(() => {
        if (loginData && Object.keys(loginData).length > 0 && !hasFetched.current) {
            const timer = setTimeout(() => {
                getClient();
                hasFetched.current = true; 
            }, 2000); 

            return () => clearTimeout(timer);
        }
    }, [loginData, getClient]);

    return useMemo(() => ({
        clients,
        createClient,
        getClient
    }), [
        clients,
        createClient,
        getClient
    ])
}

export default useClients