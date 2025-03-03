import React from 'react'
import { ClientsInterface } from '../../Context/Typescript/ClientsTypes'
import { Modal } from '@mantine/core'
import { RxCross1 } from 'react-icons/rx'
import DeliversForm from './FinancialDataTableManager/DeliversForm/DeliversForm'

interface ModalProps {
    clientData: ClientsInterface
    closeModal: () => void
    isEditing?: boolean
}

function ClientDeliversFormModal({clientData, closeModal, isEditing}: ModalProps) {
  
  return (
    <Modal
        opened={true}
        onClose={() => closeModal()}
        title={
            isEditing
                ? `Editando entrega de ${clientData.client_fullname}`
                : `Agregando una entrega en ${clientData.client_fullname}`
        }
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
      <DeliversForm clientData={clientData} closeModal={closeModal} isEditing={isEditing}/>
    </Modal>
  )
}

export default ClientDeliversFormModal