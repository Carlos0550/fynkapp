import { useAppContext } from '../../../../../../Context/AppContext'
import { IoIosCloseCircle } from "react-icons/io";
import { FaArrowCircleLeft } from "react-icons/fa";
import "./ClientFinancialData.css"
import React, { useState } from 'react';
import EditData from './Sections/EditData/EditData';
import NewDebt from './Sections/NewDebt/NewDebt';
import ClientInfo from './Sections/ClientInfo/ClientInfo';
import NewDeliver from './Sections/NewDeliver/NewDeliver';
import DeleteSelf from './Sections/DeleteSelf/DeleteSelf';

type FinancialClientSections = 'newDebt' | "newdeliver" | "editData" | "deleteSelf" | "home"

function ClientFinancialData({ closeModal }) {
    const {
        clientsHook: {
            setEditingClient
        }
    } = useAppContext()

    const [sections, setSections] = useState<FinancialClientSections>("home")
    return (
        <React.Fragment>
            {sections !== "home" && (
                <FaArrowCircleLeft
                    size={25}
                    color='#2c2c2c'
                    className='edit-data-back-icon'
                    onClick={() => {
                        setSections("home")
                        setEditingClient(false)
                    }}
                />
            )}
            <IoIosCloseCircle
                size={30}
                className='financial-close-icon'
                onClick={() => closeModal()}
            />
            {sections === "home" && <ClientInfo setSections={setSections}/> }
            {sections === "editData" && <EditData closeModal={closeModal} />}
            {sections === "newDebt" && <NewDebt closeModal={closeModal} />}   
            {sections === "newdeliver" && <NewDeliver closeModal={closeModal} />} 
            {sections === "deleteSelf" && <DeleteSelf closeModal={closeModal}/>}       
        </React.Fragment>
    )
}

export default ClientFinancialData
