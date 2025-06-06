import { useAppContext } from '../../../../../../Context/AppContext'
import { IoIosCloseCircle } from "react-icons/io";
import { FaArrowCircleLeft } from "react-icons/fa";

import React, { useEffect, useState } from 'react';
import EditData from './Sections/EditData/EditData';
import NewDebt from './Sections/NewDebt/NewDebt';
import ClientInfo from './Sections/ClientInfo/ClientInfo';
import NewDeliver from './Sections/NewDeliver/NewDeliver';
import DeleteSelf from './Sections/DeleteSelf/DeleteSelf';

import "./ClientFinancialData.css"

type FinancialClientSections = 'newDebt' | "newdeliver" | "editData" | "deleteSelf" | "home"

function ClientFinancialData({ closeModal }) {
    const {
        clientsHook: {
            setEditingClient
        },
        debtsHook: { editingDebt, setEditingDebt },
        deliversHook: { editingDeliver, setEditingDeliver }
    } = useAppContext()

    const [sections, setSections] = useState<FinancialClientSections>("home")

    const handleGoBack = () => {
        setEditingDebt(null)
        setEditingClient(false)
        setEditingDeliver(null)
        setSections("home")
    }

    useEffect(() => {
        if (editingDebt && ![null, undefined, ""].includes(editingDebt.debt_id)) setSections("newDebt")
        if (editingDeliver && ![null, undefined, ""].includes(editingDeliver.deliver_id)) setSections("newdeliver")
    }, [editingDebt?.debt_id, editingDeliver?.deliver_id])
    return (
        <React.Fragment>
            {sections !== "home" && (
                <FaArrowCircleLeft
                    size={25}
                    color='#2c2c2c'
                    className='edit-data-back-icon'
                    onClick={() => handleGoBack()}
                />
            )}
            <IoIosCloseCircle
                size={30}
                className='financial-close-icon'
                onClick={() => closeModal()}
            />

            {sections === "home" && <ClientInfo setSections={setSections} closeModal={closeModal}/>}
            {sections === "editData" && <EditData closeModal={closeModal} />}
            {sections === "newDebt" && <NewDebt closeModal={closeModal} setSections={setSections}/>}
            {sections === "newdeliver" && <NewDeliver closeModal={closeModal} setSections={setSections} />}
            {sections === "deleteSelf" && <DeleteSelf closeModal={closeModal} />}
        </React.Fragment>
    )
}

export default ClientFinancialData
