import React from 'react'
import { ClientsInterface } from '../../../Context/Typescript/ClientsTypes'
import { useAppContext } from '../../../Context/AppContext';

interface FinancialDataTableManagerProps {
    tableType: "debts" | "payments",
    clientData: ClientsInterface
}

import dayjs from "dayjs"
import { Button, Popover } from '@mantine/core';

import { FaEdit, FaTrash } from "react-icons/fa";
import { ClientDebt } from '../../../Context/Typescript/FinancialClientData';
import ClientDebtsFormModal from '../ClientDebtsFormModal';

import "./FinancialDataTableManager.css"
import ClientDeliversFormModal from '../ClientDeliversFormModal';

function FinancialDataTableManager({ tableType, clientData }: FinancialDataTableManagerProps) {
    const { debtsHook, deliversHook } = useAppContext();
    const { 
        financialClientData:{
            clientDebts,
            clientDelivers,
            totalDebtAmount
        }, 
        setEditDebtHook, 
        editDebtHook, 
        deleteDebt,
     } = debtsHook

    const {
        setEditDeliverHook,
        editDeliverHook,
        deleteDeliver
    } = deliversHook

    const handleEditDebt = (debt: ClientDebt) => {
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

    const handleCloseDeliverModal = () =>{
        setEditDeliverHook({
            isEditing: false,
            deliverID: "",
            deliverData: {
                deliver_id: "",
                deliver_date: new Date(),
                deliver_amount: "",
                deliver_client_id: ""
            }
        })
    }

    return (
        <React.Fragment>
            <div className="client-financial-data">
                <h3>Información financiera</h3>
                <p>
                    <strong>Saldo total:</strong>
                    {totalDebtAmount
                        ? totalDebtAmount.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS'
                        })
                        : "0.00"}
                </p>
                <div className="custom-table-container">
                    {/* {tableType === "debts"
                        ? <h4>Deudas</h4>
                        : <h4>Pagos</h4>
                    } */}
                    <table className='custom-table'>
                        <thead>
                            {tableType === "debts"
                            ? (
                                    <tr>
                                        <th>Fecha de compra</th>
                                        <th>Vencimiento</th>
                                        <th>Estado</th>
                                        <th>Productos</th>
                                        <th>Monto total</th>
                                        <th></th>
                                    </tr>
                            )
                            : (
                                <tr>
                                    <th>Fecha de entrega</th>
                                    <th>Monto entregado</th>
                                </tr>
                            )
                        }

                        </thead>
                        <tbody>
                            {tableType === "debts" && clientDebts.map((debt, index) => (
                                <tr key={index}>
                                    <td><p>{dayjs(debt.debt_date).format("YYYY-MM-DD")}</p></td>
                                    <td><p>{dayjs(debt.debt_exp).format("YYYY-MM-DD")}</p></td>
                                    <td><p>{debt.debt_status}</p></td>
                                    <td>{debt.debt_products.map((product, idx) => (
                                        <ul key={idx} style={{ listStyle: "none" }}>
                                            <li><p>{product.product_quantity} {product.product_name} {parseFloat(product.product_price).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></li>
                                        </ul>
                                    ))}</td>
                                    <td><p>{debt.debt_total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></td>
                                    <td className='client-debt-table-actions'>
                                        <Button color='blue' onClick={() => handleEditDebt(debt)}><FaEdit /> Editar</Button>
                                        <Popover shadow='md'>
                                            <Popover.Target>
                                                <Button color='red'><FaTrash /> Eliminar</Button>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <p><strong>Está seguro de querer eliminar esta deuda?</strong></p>

                                                <p>Esta acción no se puede deshacer</p>
                                                <Button color='red'
                                                    onClick={() => deleteDebt(debt.debt_id)}
                                                ><FaTrash /> Eliminar</Button>
                                            </Popover.Dropdown>
                                        </Popover>
                                    </td>
                                </tr>
                            ))}
                            {tableType === "payments" && clientDelivers && clientDelivers.length > 0 && clientDelivers.map((payment, index) => (
                                <tr key={index}>
                                    <td><p>{dayjs(payment.deliver_date).format("YYYY-MM-DD")}</p></td>
                                    <td><p>{payment.deliver_amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></td>
                                    <td className='client-debt-table-actions'>
                                        <Button 
                                            onClick={() => 
                                                setEditDeliverHook({
                                                    isEditing: true,
                                                    deliverID: payment.deliver_id || "",
                                                    deliverData: payment
                                                })
                                            }
                                        ><FaEdit /> Editar</Button>
                                        <Popover>
                                            <Popover.Target>
                                                <Button color='red'><FaTrash /> Eliminar</Button>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <p><strong>Está seguro de querer eliminar este pago?</strong></p>

                                                <p>Estaacción no se puede deshacer</p>
                                                <Button color='red'
                                                    onClick={() => {
                                                        deleteDeliver(payment.deliver_id || "")
                                                    }}
                                                ><FaTrash /> Eliminar</Button>
                                            </Popover.Dropdown>
                                        </Popover>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {editDebtHook.editingDebt && <ClientDebtsFormModal clientData={clientData} closeModal={handleCloseModal} isEditing={true} />}
                {editDeliverHook.isEditing && <ClientDeliversFormModal clientData={clientData} closeModal={handleCloseDeliverModal} isEditing={true} />}
            </div>
        </React.Fragment>
    )
}

export default FinancialDataTableManager