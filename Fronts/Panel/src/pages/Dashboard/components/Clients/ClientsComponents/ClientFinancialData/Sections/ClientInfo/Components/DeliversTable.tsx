import { ActionIcon, Box, Table, Text } from '@mantine/core'
import { useAppContext } from '../../../../../../../../../Context/AppContext'
import dayjs from 'dayjs'
import { HiPencilAlt } from 'react-icons/hi'

function DeliversTable() {
    const {
        financialClientHook: {
            financialClientData: {
                movimientos
            }
        },
        deliversHook: {
            setEditingDeliver,
        },

    } = useAppContext()

    const handleEditDeliver = (deliver_id: string): void => {
        const selectedDeliver = movimientos.find((f) => f.tipo === "pago" && f.id === deliver_id)
        if (selectedDeliver) {

            setEditingDeliver({
                deliver_id,
                isEditing: true,
                deliver_amount: selectedDeliver.monto.toString(),
                deliver_date: selectedDeliver.fecha.toString(),
                deliver_details: selectedDeliver.detalles!
            })
        }
    }
    const pagos = movimientos?.filter((f) => f.tipo === "pago") ?? [];
    
    return (
        <Box style={{ overflowX: 'auto' }}>
            <Table
                highlightOnHover
                withTableBorder
                verticalSpacing="sm"
                style={{ marginTop: 16, minWidth: 800 }}
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Fecha de pago</Table.Th>
                        <Table.Th>Monto de entrega</Table.Th>
                        <Table.Th>Detalles</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {pagos.length > 0 ? (
                        pagos.map((deliver, idx) => (
                            <Table.Tr key={idx}>
                                <Table.Td>{dayjs(deliver.fecha).format('DD/MM/YYYY')}</Table.Td>
                                <Table.Td>
                                    {parseFloat(deliver.monto.toString()).toLocaleString('es-AR', {
                                        style: 'currency',
                                        currency: 'ARS',
                                    })}
                                </Table.Td>
                                <Table.Td>{deliver.detalles}</Table.Td>
                                <Table.Td>
                                    <ActionIcon color="gray" variant="subtle" size="sm" onClick={() => handleEditDeliver(deliver.id)}>
                                        <HiPencilAlt size={20} />
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={4}>
                                <Text ta="center" c="dimmed">
                                    Es lo que creíste, no hay que para mostrar
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Box>
    )
}

export default DeliversTable
