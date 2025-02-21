import { useCallback, useMemo, useState } from "react"
import { Clients } from "./Typescript/ClientsTypes"
import { logic_apis } from "../apis"
function useClients() {
    const [clients, setClients] = useState<Clients[]>([])

    const createClient = useCallback(async (clientData) => {
        const url = new URL(logic_apis.clients + "/create-client")
        const formData = new FormData()
        try {
            for (const key in clientData) {
                formData.append(key, clientData[key])
            }
            const response = await fetch(url, {
                method: "POST",
                body: formData
            })
            const responseData = await response.json()
            if(!response.ok){
                
                throw new Error(responseData.msg || "Error desconocido")
            }
            
            setClients([...clients, ...responseData.clients])
            return true
        } catch (error) {
            console.log(error)
            
            return false
        }
    }, [])
    return useMemo(() => ({
        clients,
        createClient
    }),[
        clients,
        createClient
    ])
}

export default useClients