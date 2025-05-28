import React, { useEffect, useState } from 'react'
import { Button, Input, Notification } from '@mantine/core';
import { FormClient } from "../../../../../../Context/Typescript/ClientsTypes"
import "./ClientForm.css"
import { useAppContext } from '../../../../../../Context/AppContext';

function ClientForm({ closeModal }) {
    const [loading, setLoading] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const {
        clientsHook: {
            saveClient,
            editingClient
        },
        modalsHook:{
            selectedClientData
        }
    } = useAppContext()
    const [formData, setFormData] = useState<FormClient>({
        client_name: "",
        client_dni: "",
        client_email: "",
        client_address: "",
    })

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSaveClient = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const result = await saveClient(formData)
        setLoading(false)
        if (result) {
            setShowNotif(true)
            setTimeout(() => {
                setShowNotif(false)
                closeModal()
            }, 1000);
        }
    }

    useEffect(()=>{
        if(editingClient){
            const { aditional_client_data } = selectedClientData
            setFormData({
                client_name: selectedClientData.client_name,
                client_dni: aditional_client_data?.client_dni || "",
                client_email: aditional_client_data?.client_email || "",
                client_address: aditional_client_data?.client_address || ""
            })
        }
    },[editingClient, selectedClientData])
    return (
        <form className='client-form' onSubmit={handleSaveClient}>
            {
                !showNotif
                    ? (
                        <React.Fragment>
                            <Input.Wrapper
                                label="Nombre completo"
                                required
                            >
                                <Input
                                    name="client_name"
                                    type="text"
                                    value={formData.client_name}
                                    onChange={handleOnChange}
                                />
                            </Input.Wrapper>

                            <Input.Wrapper
                                label="DNI"
                            >
                                <Input
                                    name="client_dni"
                                    type="text"
                                    value={formData.client_dni}
                                    onChange={handleOnChange}
                                />
                            </Input.Wrapper>

                            <Input.Wrapper
                                label="Correo"
                            >
                                <Input
                                    name="client_email"
                                    type="email"
                                    value={formData.client_email}
                                    onChange={handleOnChange}
                                />
                            </Input.Wrapper>

                            <Input.Wrapper
                                label="Dirección"
                            >
                                <Input
                                    name="client_address"
                                    type="text"
                                    value={formData.client_address}
                                    onChange={handleOnChange}
                                />
                            </Input.Wrapper>



                            <Button
                            color='dark'
                                loading={loading}
                                type='submit'
                                className='client-form-button'
                                disabled={loading}
                            >
                                Guardar cliente
                            </Button>
                        </React.Fragment>
                    )
                    : <Notification
                        title="Cliente guardado exitosamente"
                        withBorder
                        radius={"xs"}
                        color='lime'
                    >
                    </Notification>
            }

        </form>
    )
}

export default ClientForm
