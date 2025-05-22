import {
    Table,
    Text,
    Group,
    ActionIcon,
    Badge,
    Box,
} from '@mantine/core'
import { HiPencilAlt } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { useAppContext } from '../../../../../../../../../Context/AppContext';
import dayjs from "dayjs"
import { showNotification } from '@mantine/notifications';
import { DebtForm, EditingData } from '../../../../../../../../../Context/Typescript/DebtsTypes';
import { FinancialClient } from '../../../../../../../../../Context/Typescript/FinancialTypes';

function DebtTable() {
    const {
        financialClientHook: { financialClientData },
        debtsHook: { setEditingDebt }
    } = useAppContext()

    const calculateTotal = (debtData: FinancialClient) => {
        let total = 0;
        debtData.productos?.forEach((el) => {
            total += parseFloat(el.product_price.toString()) * parseInt(el.product_quantity.toString())
        })

        return total.toString()
    }
    const handleEditDebt = (debt_id: string): void => {
        const debts = financialClientData.filter(f => f.tipo === "deuda" && f.id === debt_id)
        if (debts && debts.length > 0) {
            const debtData = debts[0]

            setEditingDebt({
                debt_id,
                debt_date: debtData.fecha,
                debt_products: debtData.productos || [],
                debt_total: calculateTotal(debtData),
            })

            return;
        }
        showNotification({
            message: "Hubo un error al procesar la deuda, recargue esta sección e intente nuevamente.",
            autoClose: 3500,
            position: "top-right",
            color: "yellow"
        })
        return;
    }
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
                        <Table.Th>Fecha de compra</Table.Th>
                        <Table.Th>Vencimiento</Table.Th>
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Productos</Table.Th>
                        <Table.Th>Monto total</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {financialClientData && financialClientData.filter(m => m.tipo === "deuda").length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Text ta="center" c="dimmed">Mmm, al parecer no hay nada por mostrar</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : financialClientData
                        .filter((type) => type.tipo === "deuda")
                        .map((debt) => (
                            <Table.Tr key={debt.id}>
                                <Table.Td>{dayjs(debt.fecha).format("DD/MM/YYYY")}</Table.Td>
                                <Table.Td>{dayjs(debt.vencimiento).format("DD/MM/YYYY")}</Table.Td>
                                <Table.Td>
                                    <Badge color={
                                        debt.estado === "Vencida" ? "red" : debt.estado === "Por vencer" ? "yellow" : "green"

                                    } variant="light">{debt.estado}</Badge>
                                </Table.Td>
                                <Table.Td>
                                    {debt.productos!.map((p, idx) => (
                                        <Text key={idx} size="sm">
                                            • {p.product_name} ({p.product_quantity}u) - ${p.product_price.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                                        </Text>
                                    ))}
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={600}>${debt.monto.toLocaleString("es-AR")}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={5}>
                                        <ActionIcon color="gray" variant="subtle" size="sm" onClick={() => handleEditDebt(debt.id)}>
                                            <HiPencilAlt size={20} />
                                        </ActionIcon>
                                        <ActionIcon color="red" variant="subtle" size="sm">
                                            <IoTrashOutline size={20} color='red' />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }
                </Table.Tbody>
            </Table>
        </Box>
    )
}

export default DebtTable
