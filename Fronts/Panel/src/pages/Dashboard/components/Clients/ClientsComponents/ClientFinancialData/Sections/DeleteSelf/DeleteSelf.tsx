import { Button, Flex, Text, Card, Title } from '@mantine/core'
import { useState } from 'react'
import { useAppContext } from '../../../../../../../../Context/AppContext'

function DeleteSelf({ closeModal }) {
    const [deleting, setDeleting] = useState(false)
    const {
        clientsHook: {
            deleteClient
        }
    } = useAppContext()

    const handleDelete = async () => {
        setDeleting(true)
        const result = await deleteClient()
        setDeleting(false)

        if(result) closeModal()
    }

    return (
        <Flex justify="center" align="center" p="md" style={{ minHeight: "50vh" }}>
            <Card shadow="sm" padding="lg" radius="md" w={"100%"} maw={500}>

                <Flex direction="column" gap="md">
                    <Title order={4} c="red" ta="center">
                        ¿Está seguro de que desea eliminar a este cliente?
                    </Title>

                    <Text c="red" ta="center">
                        Todos sus datos, incluidos deudas, entregas e historial, serán eliminados y no se podrán recuperar.
                    </Text>

                    <Flex gap="sm" justify="space-between">
                        <Button
                            fullWidth
                            color="red"
                            onClick={handleDelete}
                            disabled={deleting}
                            loading={deleting}
                        >
                            Sí, eliminar cliente
                        </Button>
                        <Button
                            fullWidth
                            variant="outline"
                            disabled={deleting}
                            onClick={closeModal}
                        >
                            No, cancelar
                        </Button>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    )
}

export default DeleteSelf
