import React from 'react'
import { Modal } from "@mantine/core"
import ClientForm from '../../Clients/ClientForm/ClientForm';

interface ModalProps{
    closeModal: () => void;
}
function FastAddClientModal({closeModal}:ModalProps) {
  return (
    <Modal
        opened={true}
        title="Añadir un cliente"
        onClose={() => closeModal()}
        padding="sm"
        overlayProps={{
            backgroundOpacity: 0.6,
            blur: 5,
        }}
        size={"xl"}
    >
        <ClientForm closeModal={closeModal} />
    </Modal>
  )
}

export default FastAddClientModal