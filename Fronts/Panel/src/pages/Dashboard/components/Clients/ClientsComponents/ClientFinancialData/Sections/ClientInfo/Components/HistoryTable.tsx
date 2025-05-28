import { Box, Table, Text, Badge, Flex, List } from '@mantine/core'
import { useAppContext } from '../../../../../../../../../Context/AppContext'
import dayjs from "dayjs"
import { FinancialClient } from '../../../../../../../../../Context/Typescript/FinancialTypes'
function HistoryTable() {
    const {
        financialClientHook: {
            financialClientData:{
                historial
            }
        }
    } = useAppContext()

    const getBadgeColor = (type:FinancialClient["historial"][0]["tipo"]) => {

        if(type === "deuda") return {
            color: "orange",
            label: "Deuda"
        }
        if(type === "pago")return{
            color: "lime",
            label: "Entrega"
        }
    }

    const getBadgeColor2 = (type:FinancialClient["historial"][0]["estado_financiero"]) => {
        if(type === "cerrado"){
            return{
                color: "green",
                label: "Pagada"
            }
        }else if(type === "eliminado"){
            return{
                color: "red",
                label: "Eliminada"
            }
        }
    }
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
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Monto</Table.Th>
                        <Table.Th>Vencimiento</Table.Th>
                        <Table.Th>Detalles</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {historial && historial!.length > 0 ? historial
                    .map((mov, idx) => (
                        <Table.Tr key={idx}>
                            <Table.Td>{dayjs(mov.fecha).format('DD/MM/YYYY')}</Table.Td>
                            <Table.Td>
                                <Badge color={getBadgeColor(mov.tipo)!.color} variant="filled">
                                    {getBadgeColor(mov.tipo)!.label}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Badge color={getBadgeColor2(mov.estado_financiero)!.color} variant="light">
                                    {getBadgeColor2(mov.estado_financiero)!.label}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                {Number(mov.monto).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                            </Table.Td>
                            <Table.Td>
                                {mov.vencimiento ? dayjs(mov.vencimiento).format('DD/MM/YYYY') : 'No aplica'}
                            </Table.Td>
                            <Table.Td>{mov.tipo === "deuda" ? (
                                <Flex justify={"center"} gap={10} direction={"column"}>
                                    <List>
                                        {mov.productos?.map((prod, idx) => (
                                            <List.Item key={idx}>
                                                <Text size="sm" c="#7C7C7C">{prod.product_quantity} {prod.product_name} {prod.product_price}</Text>
                                            </List.Item>
                                        ))}
                                    </List>
                                </Flex>
                            ) : (
                                <Flex justify={"center"} gap={10} direction={"column"}>
                                    <List>
                                        <List.Item>
                                            <Text size="sm" c="#7C7C7C">{mov.detalles || "N/A"}</Text>
                                        </List.Item>
                                    </List>
                                </Flex>
                            )}</Table.Td>
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
