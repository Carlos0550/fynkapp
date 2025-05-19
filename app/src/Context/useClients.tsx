import { useCallback, useEffect, useMemo, useState } from 'react'
import { logic_apis } from "../apis"
import { ClientInterface, FormClient } from './Typescript/ClientsTypes'
import { showNotification } from '@mantine/notifications'

interface Props{
    client_id: string
}
function useClients({client_id}: Props) {
    const [clients, setClients] = useState<ClientInterface[]>([])
    const [editingClient, setEditingClient] = useState<boolean>(false)
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
    const url = new URL(logic_apis.clients + "/save-client");
    if (editingClient) {

        url.searchParams.append("client_id", client_id)
        url.searchParams.append("editing_client", "true")
    }

    try {
        const result = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
            },
            body: JSON.stringify(formData)
        });

        const responseData = await result.json();

        if (!result.ok) throw new Error(responseData.msg || "Error desconocido");

        if (editingClient) {
            setClients((prev) =>
                prev.map((client) =>
                    client.client_id === responseData.updatedClient.client_id
                        ? responseData.updatedClient
                        : client
                )
            );
        } else {
            await getAllClients();
        }

        return true;
    } catch (error) {
        console.error("Error al guardar el cliente:", error);
        return false;
    }
}, [editingClient, client_id, getAllClients]);


    const getClientData = useCallback(async(client_id: string): Promise<boolean | ClientInterface> => {
        const url = new URL(logic_apis.clients + "/get-client-data")
        url.searchParams.set("client_id", client_id)
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            });

            const responseData = await response.json()
            if(response.status === 404){
                showNotification({
                    color: "red",
                    title: "Error al obtener los datos del cliente",
                    styles: (theme) => ({
                        title:{color: "black"},
                        description: {color: "black"}
                    }),
                    message: responseData.msg || "Error desconocido",
                    autoClose: 3500,
                    position: "top-right"
                })
                return false
            }
            if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
            return responseData
        } catch (error) {
            console.log(error)
            if (error instanceof TypeError) return false
            showNotification({
                color: "red",
                title: "Error al obtener los datos del cliente",
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

    const deleteClient = useCallback(async(): Promise<boolean> => {
        const url = new URL(logic_apis.clients + "/delete-client")
        url.searchParams.append("client_id", client_id)
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            })
            const responseData = await response.json()
            if(response.status === 404){
                showNotification({
                    color: "red",
                    title: "Error al eliminar el cliente",
                    styles: (theme) => ({
                        title:{color: "black"},
                        description: {color: "black"}
                    }),
                    message: responseData.msg || "Error desconocido",
                    autoClose: 3500,
                    position: "top-right"
                })
                return false
            }
            if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
                
            await getAllClients()
            return true
        } catch (error) {
            console.log(error)
            if (error instanceof TypeError) return false
            showNotification({
                color: "red",
                title: "Error al eliminar el cliente",
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
    },[client_id, getAllClients])
    return useMemo(() => ({
        saveClient, clients, getAllClients, setClients,
        getClientData, editingClient, setEditingClient,
        deleteClient
    }), [
        saveClient, clients, getAllClients, setClients,
        getClientData, editingClient, setEditingClient,
        deleteClient
    ])
}

export default useClients
