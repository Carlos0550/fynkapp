import { Box, Table, Text, Badge } from '@mantine/core'
import { useAppContext } from '../../../../../../../../../Context/AppContext'
import dayjs from "dayjs"
function HistoryTable() {
    const {
        financialClientHook: {
            historyClientData
        }
    } = useAppContext()
    return (
        <Box mt="md" style={{ overflowX: 'auto' }}>
            <Text fw={600} size="lg" mb="xs">Historial del cliente</Text>

            <Table
                highlightOnHover
                withTableBorder
                verticalSpacing="sm"
                style={{ minWidth: 800 }}
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Fecha</Table.Th>
                        <Table.Th>Tipo</Table.Th>
                        <Table.Th>Monto</Table.Th>
                        <Table.Th>Vencimiento</Table.Th>
                        <Table.Th>Detalles</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {historyClientData!.length > 0 ? historyClientData.map((mov) => (
                        <Table.Tr key={mov.id}>
                            <Table.Td>{dayjs(mov.fecha).format('DD/MM/YYYY')}</Table.Td>
                            <Table.Td>
                                <Badge color={mov.tipo === 'deuda' ? 'orange' : 'lime'} variant="light">
                                    {mov.tipo === 'deuda' ? 'Deuda' : 'Entrega'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                {Number(mov.monto).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                            </Table.Td>
                            <Table.Td>
                                {mov.vencimiento ? dayjs(mov.vencimiento).format('DD/MM/YYYY') : '—'}
                            </Table.Td>
                            <Table.Td>{mov.detalles || '—'}</Table.Td>
                        </Table.Tr>
                    )) : (
                        <Table.Tr>
                            <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                                No hay historial disponible.
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Box>
    );
}

export default HistoryTable
