import React from 'react';
import { ClientDebt } from '../../../Context/Typescript/FinancialClientData';
import { Button, Popover } from '@mantine/core';
import { FaEdit, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";

interface DebtTableProps {
    clientDebts: ClientDebt[];
    handleEditDebt: (debt: ClientDebt) => void;
    deleteDebt: (debtId: string) => void;
}

function DebtTable({ clientDebts, handleEditDebt, deleteDebt }: DebtTableProps) {
    const calculateTotalDebt = (products: ClientDebt["debt_products"]) => {
        return products.reduce((total, product) => {
            return total + parseFloat(product.product_price) * parseInt(product.product_quantity);
        }, 0);
    };
    return (
        <table className='custom-table'>
            <thead>
                <tr>
                    <th>Fecha de compra</th>
                    <th>Vencimiento</th>
                    <th>Estado</th>
                    <th>Productos</th>
                    <th>Monto total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {clientDebts && clientDebts.map((debt, index) => (
                    <tr key={index}>
                        <td><p>{dayjs(debt.debt_date).format("DD-MM-YYYY")}</p></td>
                        <td><p>{dayjs(debt.exp_date).format("DD-MM-YYYY")}</p></td>
                        <td><p>{debt.debt_status}</p></td>
                        <td>
                            {debt.debt_products.map((product, idx) => (
                                <ul key={idx} style={{ listStyle: "none" }}>
                                    <li><p>{product.product_quantity} {product.product_name} {parseFloat(product.product_price).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></li>
                                </ul>
                            ))}
                        </td>
                        <td><p>{calculateTotalDebt(debt.debt_products).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></td>
                        <td className='client-debt-table-actions'>
                            <Button color='blue' onClick={() => handleEditDebt(debt)}><FaEdit /> Editar</Button>
                            <Popover shadow='md'>
                                <Popover.Target>
                                    <Button color='red'><FaTrash /> Eliminar</Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <p><strong>Está seguro de querer eliminar esta deuda?</strong></p>
                                    <p>Esta acción no se puede deshacer</p>
                                    <Button color='red' onClick={() => deleteDebt(debt.debt_id)}><FaTrash /> Eliminar</Button>
                                </Popover.Dropdown>
                            </Popover>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DebtTable;