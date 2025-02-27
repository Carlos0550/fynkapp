import { Modal } from '@mantine/core'
import React, { useState } from 'react'
import { ClientsInterface } from '../../Context/Typescript/ClientsTypes.ts'
import { useAppContext } from "../../Context/AppContext.tsx"

import { RxCross1 } from "react-icons/rx";
import DebtForm from './DebtTable/DebtForm/DebtForm.tsx';

interface ModalProps {
    clientData: ClientsInterface
    closeModal: () => void
    isEditing?: boolean
}
function ClientDebtsFormModal({ clientData, closeModal, isEditing }: ModalProps) {
    const { width } = useAppContext()
    const [isMobile] = useState(width < 768)
    return (
        <Modal
            opened={true}
            onClose={() => closeModal()}
            title={
                isEditing
                    ? `Editando deuda de ${clientData.client_fullname}`
                    : `Agregando una deuda en ${clientData.client_fullname}`
            }
            fullScreen={isMobile}
            padding="sm"
            overlayProps={{
                backgroundOpacity: 0.6,
                blur: 5,
            }}
            closeButtonProps={{
                icon: <RxCross1 />,
            }}
            size={"xl"}
        >
            <DebtForm clientData={clientData} closeModal={closeModal} isEditing={isEditing}/>
        </Modal>
    )
}

export default ClientDebtsFormModal