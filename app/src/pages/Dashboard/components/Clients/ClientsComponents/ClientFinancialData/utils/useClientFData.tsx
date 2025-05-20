import { useEffect, useRef, useState } from "react"
import { ClientInterface } from "../../../../../../../Context/Typescript/ClientsTypes"
import { useAppContext } from "../../../../../../../Context/AppContext"

function useClientFData() {
    const {
        clientsHook: {
            getClientData,
            setClients
        },
        modalsHook: {
            selectedClientData,
            setSelectedClientData
        }
    } = useAppContext()

    const [clientData, setClientData] = useState<ClientInterface>({
        client_id: "",
        client_name: "",
        manager_client_id: "",
        aditional_client_data: {
            client_dni: "",
            client_email: "",
            client_address: "",
        },
        total_debts: ""
    })

    const [gettingClientData, setGettingClientData] = useState(false)
    const [aditionalDataLength, setAditionalDataLength] = useState(0)
    const handleGetClientData = async () => {
        setGettingClientData(true)
        const result = await getClientData(selectedClientData.client_id)
        
        if (typeof result !== 'boolean') {
            setClientData(result)
            setSelectedClientData(result)
            const { aditional_client_data } = result
            if (aditional_client_data) {
                let count = 0
                for (const key in aditional_client_data) {
                    if (aditional_client_data[key] !== null) {
                        count++
                    }
                }
                setAditionalDataLength(count)
            }
        }
        setGettingClientData(false)
    }

    const alreadyGotClientData = useRef(false)
    useEffect(() => {
        if (selectedClientData &&
            ![null, "", undefined].includes(selectedClientData.client_id) &&
            !alreadyGotClientData.current
        ) {
            alreadyGotClientData.current = true
            handleGetClientData()
        }
    }, [selectedClientData])

    return {
        gettingClientData,
        clientData,
        aditionalDataLength
    }
}

export default useClientFData
