import { ActionIcon, Box, Table, Text } from '@mantine/core'
import React from 'react'
import { useAppContext } from '../../../../../../../../../Context/AppContext'
import dayjs from 'dayjs'
import { HiPencilAlt } from 'react-icons/hi'

function DeliversTable() {
    const {
        financialClientHook: {
            financialClientData
        }
    } = useAppContext()
    return (
        <Box
            style={{
                overflowX: 'auto',
            }}
        >
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
                    {financialClientData && financialClientData.length > 0 ? (
                        financialClientData.filter((f) => f.tipo === "pago").map((deliver) => (
                            <Table.Tr key={deliver.id}>
                                <Table.Td>{dayjs(deliver.fecha).format('DD/MM/YYYY')}</Table.Td>
                                <Table.Td>{parseFloat(deliver.monto.toString()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</Table.Td>
                                <Table.Td>{deliver.detalles}</Table.Td>
                                <Table.Td>
                                    <ActionIcon color="gray" variant="subtle" size="sm">
                                        <HiPencilAlt size={20} />
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Text ta="center" c="dimmed">Es lo que creíste, no hay que para mostrar</Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Box>
    )
}

export default DeliversTable
