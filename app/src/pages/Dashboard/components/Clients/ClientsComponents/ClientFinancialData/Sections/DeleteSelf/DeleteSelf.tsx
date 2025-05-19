import { Button, CheckIcon, Flex, Group, Notification, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../../../../../../Context/AppContext'

function DeleteSelf({ closeModal }) {
    const [deleting, setDeleting] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const {
        clientsHook: {
            deleteClient
        }
    } = useAppContext()
    const handleDelete = async () => {
        setDeleting(true)
        const result = await deleteClient()
        setDeleting(false)
        if (result) setDeleted(true)
    }

    useEffect(() => {
        if (deleted) {
            setTimeout(() => {
                closeModal()
            }, 4000)
        }
    },[deleted])
    return (
        <Flex
            gap={10}
            direction={"column"}
            justify={"center"}
            align={"center"}
            mih={"100vh"}
        >
            {deleted
            ? (
                <Notification
                    color='red'
                    mt={30}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    withCloseButton={false}
                    icon={<CheckIcon/>}
                    
                >
                    <Text fw={600} c={"red"}>Cliente eliminado con exito</Text>
                    <Text fw={400}>El cliente junto con sus deudas, entregas e historial fue eliminado exitosamente.</Text>
                </Notification>
            ) 
            : <React.Fragment>
                    <Text
                        fw={900}
                        size='1.3rem'
                        c={"red"}
                    >
                        ¿Está seguro de que desea eliminar a este cliente?
                    </Text>

                    <Text
                        fw={600}

                        c={"red"}
                    >
                        Todos sus datos incluídos deudas, entregas e historial serán eliminados y no se podrán recuperar
                    </Text>

                    <Flex gap={10} justify={'space-evenly'} w={'100%'}>
                        <Button 
                            fullWidth 
                            color='red' 
                            onClick={handleDelete}
                            disabled={deleting}
                            loading={deleting}
                        >Si, eliminar cliente</Button>
                        <Button 
                            fullWidth 
                            variant='outline'
                            disabled={deleting}
                        >No, cancelar eliminación</Button>
                    </Flex>
                </React.Fragment>
            }
        </Flex>
    )
}

export default DeleteSelf
