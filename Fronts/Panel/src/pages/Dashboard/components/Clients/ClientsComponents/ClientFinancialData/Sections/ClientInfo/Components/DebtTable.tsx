import {
    Table,
    Text,
    Group,
    ActionIcon,
    Badge,
    Box,
    Dialog,
    Button,
} from '@mantine/core'
import { HiPencilAlt } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { useAppContext } from '../../../../../../../../../Context/AppContext';
import dayjs from "dayjs"
import { showNotification } from '@mantine/notifications';
import { FinancialClient } from '../../../../../../../../../Context/Typescript/FinancialTypes';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { ClientInterface } from '../../../../../../../../../Context/Typescript/ClientsTypes';

function DebtTable() {
    const {
        financialClientHook: { financialClientData:{
            movimientos
        }, setFinancialClientData },
        debtsHook: { setEditingDebt, deleteDebt },
        modalsHook: {setSelectedClientData},
        clientsHook: {setClients, getClientData},
        width
    } = useAppContext()

    const calculateTotal = (debtData: FinancialClient["movimientos"][0]) => {
        let total = 0;
        debtData.productos?.forEach((el) => {
            total += parseFloat(el.product_price.toString()) * parseInt(el.product_quantity.toString())
        })

        return total.toString()
    }

    const [deleting, setDeleting] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);
    const [debtId, setDebtId] = useState<string | null>(null)
    const handleDeleteDebt = async (): Promise<void> => {
        setDeleting(true) 
        const result = await deleteDebt(debtId || "")
        setDeleting(false)
        close()
        setDebtId(null)

        if(result){
            const newClientData = await getClientData() as ClientInterface
            const newTotalDebts = newClientData.total_debts
            setSelectedClientData((prev) => ({
                ...prev,
                total_debts: newTotalDebts
            }))

            setClients((prev) => prev.map((client) => {
                if (client.client_id === newClientData.client_id) {
                    return {
                        ...client,
                        total_debts: newTotalDebts
                    }
                }
                return client
            }))

            setFinancialClientData((prev: FinancialClient) => ({
                ...prev,
                movimientos: prev.movimientos.filter(f => f.id !== debtId)
            }))
        }
    }
    const handleEditDebt = (debt_id: string): void => {
        const debts = movimientos.filter(f => f.tipo === "deuda" && f.id === debt_id)
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

    const mobileDialogPosition = {
        right: 0,
        bottom: 150
    }
    return (
        <Box style={{ overflowX: 'auto' }}>
            {opened && (
                <Dialog position={width < 600 ? mobileDialogPosition : undefined} opened={opened} onClose={close} title="Eliminar deuda" withCloseButton={!deleting}>
                    <Text c={"red"} fw={700} ta="center" size="1.1rem">¿Desea eliminar esta deuda?</Text>
                    <Text c={"red"} fw={600} mt="sm">Antes de eliminar, tenga en cuenta:</Text>
                    <ul style={{ marginLeft: 20, color: "#c92a2a", fontWeight: 500 }}>
                        <li>Se evaluará si el cliente tiene pagos mayores a la deuda, para evitar saldo negativo.</li>
                        <li>Si esto ocurre, no se permitirá eliminar hasta que el cliente complete su pago.</li>
                        <li>Si no ocurre, y esta es su única deuda, se moverá al historial con el estado <strong>"Eliminado"</strong>.</li>
                    </ul>
                    <Text c="red" fw={500} mt="xs">La deuda eliminada podrá verse en el historial con el filtro correspondiente.</Text>
                    <Text c="red" fw={600} mt="xs">¡Esta acción no se puede deshacer!</Text>

                    <Group mt="md">
                        <Button onClick={close}>Cancelar</Button>
                        <Button loading={deleting} color="red" onClick={() => handleDeleteDebt()}>Eliminar</Button>
                    </Group>
                </Dialog>
            )}
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
                    {movimientos && movimientos.filter(m => m.tipo === "deuda").length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Text ta="center" c="dimmed">Mmm, al parecer no hay nada por mostrar</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : movimientos && movimientos
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
                                            • {p.product_name} ({p.product_quantity}u) - {Number(p.product_price).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                                        </Text>
                                    ))}
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={600}>{Number(debt.monto).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={5}>
                                        <ActionIcon color="gray" variant="subtle" size="sm" onClick={() => handleEditDebt(debt.id)}>
                                            <HiPencilAlt size={20} />
                                        </ActionIcon>
                                        <ActionIcon color="red" variant="subtle" size="sm" onClick={()=>{
                                            setDebtId(debt.id)
                                            open()
                                        }}>
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
