import { Modal } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { useAppContext } from '../../Context/AppContext.tsx'
import ClientForm from '../ClientForm/ClientForm.jsx'

import {ClientsInterface} from "../../Context/Typescript/ClientsTypes.ts"

function EditClientModal() {
    const { width, 
        clientsHook:{
            setEditingClient, clients, editingClient
        }
     } = useAppContext()
    const [fullScreeen] = useState(width < 768)

    
    const [clientData, setClientData] = useState<ClientsInterface>({
        client_id: "",
        client_dni: 0,
        client_fullname: "",
        client_email: "",
        client_address: "",
        client_city: "",
        client_phone: 0
    })

    const handleCloseModal = () => {
        setClientData({
            client_id: "",
            client_dni: 0,
            client_fullname: "",
            client_email: "",
            client_address: "",
            client_city: "",
            client_phone: 0
        })
        setEditingClient({ isEditing: false, clientID: "" })
    }

    useEffect(()=>{
        if(editingClient && editingClient.isEditing){
            const client = clients.find((client) => client.client_id === editingClient.clientID)
            setClientData(client || clientData)
        }
    },[clients, editingClient])
  return (
    <Modal
        opened={true}
        onClose={() => {handleCloseModal()}}
        title=<p>Editando datos de <strong>{clientData.client_fullname}</strong></p>
        size="xl"
        centered
        padding="sm"
        overlayProps={{
            backgroundOpacity: 0.6,
            blur: 5,
        }}
        closeButtonProps={{
            icon: <RxCross1 />,
        }}
    >
        <ClientForm closeModal={() => handleCloseModal()} clientData={clientData}/>
    </Modal>
  )
}

export default EditClientModal