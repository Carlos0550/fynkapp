import React from 'react';
import { DeliverDataInterface } from '../../../Context/Typescript/DeliversTypes';
import { Button, Popover } from '@mantine/core';
import { FaEdit, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";

interface DeliversTableProps {
    clientDelivers: DeliverDataInterface[];
    setEditDeliverHook: (data: any) => void;
    deleteDeliver: (deliverId: string) => void;
}

function DeliversTable({ clientDelivers, setEditDeliverHook, deleteDeliver }: DeliversTableProps) {
    return (
        <table className='custom-table'>
            <thead>
                <tr>
                    <th>Fecha de entrega</th>
                    <th>Monto entregado</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {clientDelivers && clientDelivers.map((payment, index) => (
                    <tr key={index}>
                        <td><p>{dayjs(payment.deliver_date).format("YYYY-MM-DD")}</p></td>
                        <td><p>{payment.deliver_amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></td>
                        <td className='client-debt-table-actions'>
                            <Button onClick={() => setEditDeliverHook({
                                isEditing: true,
                                deliverID: payment.deliver_id || "",
                                deliverData: payment
                            })}><FaEdit /> Editar</Button>
                            <Popover>
                                <Popover.Target>
                                    <Button color='red'><FaTrash /> Eliminar</Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <p><strong>Está seguro de querer eliminar este pago?</strong></p>
                                    <p>Esta acción no se puede deshacer</p>
                                    <Button color='red' onClick={() => deleteDeliver(payment.deliver_id || "")}><FaTrash /> Eliminar</Button>
                                </Popover.Dropdown>
                            </Popover>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DeliversTable;