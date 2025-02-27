import React, { useEffect, useState } from 'react'
import "./ClientsDebtTable.css"
import { ClientsInterface } from '../../../Context/Typescript/ClientsTypes';
import { useAppContext } from '../../../Context/AppContext';
import dayjs from "dayjs"
import { Button, Divider, Popover, Space } from '@mantine/core';

import { FaEdit, FaTrash } from "react-icons/fa";
import { ClientDebt } from '../../../Context/Typescript/FinancialClientData';
import ClientDebtsFormModal from '../ClientDebtsFormModal';

interface ClientInfoProps {
    clientData: ClientsInterface;
}
function ClientDebtsTable({ clientData }: ClientInfoProps) {
    const { debtsHook } = useAppContext();
    const { financialClientData, setEditDebtHook, editDebtHook, deleteDebt } = debtsHook

    const handleEditDebt = (debt: ClientDebt) => {
        console.log(debt)
        setEditDebtHook({
            editingDebt: true,
            debtID: debt.debt_id,
            debtData: {
                debt_id: debt.debt_id,
                debt_products: debt.debt_products,
                debt_date: debt.debt_date,
            }
        })
    }

    const handleCloseModal = () => {
        setEditDebtHook({
            editingDebt: false,
            debtID: "",
            debtData: {
                debt_id: "",
                debt_products: [],
                debt_date: "",
            }
        })
    }
    return (
        <div className="client-financial-data">
            <h3>Información financiera</h3>
            <p>
              <strong>Saldo total:</strong>
              {financialClientData?.totalDebtAmount
                ? financialClientData.totalDebtAmount.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                  })
                : "0.00"}
            </p>
            <div className="client-debt-tables">
                <h4>Deudas</h4>
                <table>
                    <thead>
                        <th>Creado el</th>
                        <th>Fecha de compra</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                        <th>Productos</th>
                        <th>Monto total</th>
                        
                    </thead>
                    <tbody>
                        {financialClientData.clientDebts.map((debt, index) => (
                            <tr key={index}>
                                <td>{dayjs(debt.created_at).format("YYYY-MM-DD")}</td>
                                <td>{dayjs(debt.debt_date).format("YYYY-MM-DD")}</td>
                                <td>{dayjs(debt.debt_exp).format("YYYY-MM-DD")}</td>
                                <td>{debt.debt_status}</td>
                                <td>{debt.debt_products.map((product, idx) => (
                                    <ul key={idx} style={{ listStyle: "none" }}>
                                        <li>{product.product_quantity} {product.product_name} {parseFloat(product.product_price).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</li>
                                    </ul>
                                ))}</td>
                                <td>{debt.debt_total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                                <td className='client-debt-table-actions'>
                                    <Button color='blue' onClick={()=> handleEditDebt(debt)}><FaEdit /> Editar</Button>
                                    <Popover shadow='md'>
                                        <Popover.Target>
                                            <Button color='red'><FaTrash/> Eliminar</Button>
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                            <p><strong>Está seguro de querer eliminar esta deuda?</strong></p>
                                            
                                            <p>Esta acción no se puede deshacer</p>
                                            <Button color='red' 
                                                onClick={() => deleteDebt(debt.debt_id)}
                                            ><FaTrash/> Eliminar</Button>
                                        </Popover.Dropdown>
                                    </Popover>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="client-money-delivers-table"></div>
            {editDebtHook.editingDebt && <ClientDebtsFormModal clientData={clientData} closeModal={handleCloseModal} isEditing={true}/>}
        </div>
    )
}

export default ClientDebtsTable