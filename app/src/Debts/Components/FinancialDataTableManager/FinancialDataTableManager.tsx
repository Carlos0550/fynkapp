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
import DebtTable from '../Components/DebtTable';
import DeliversTable from '../Components/DeliversTable';

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
                    {tableType === "debts"
                        ? <DebtTable clientDebts={clientDebts || []} handleEditDebt={handleEditDebt} deleteDebt={deleteDebt} />
                        : <DeliversTable clientDelivers={clientDelivers || []} setEditDeliverHook={setEditDeliverHook} deleteDeliver={deleteDeliver} />
                    }
                </div>
                {editDebtHook.editingDebt && <ClientDebtsFormModal clientData={clientData} closeModal={handleCloseModal} isEditing={true} />}
                {editDeliverHook.isEditing && <ClientDeliversFormModal clientData={clientData} closeModal={handleCloseDeliverModal} isEditing={true} />}
            </div>
        </React.Fragment>
    )
}

export default FinancialDataTableManager