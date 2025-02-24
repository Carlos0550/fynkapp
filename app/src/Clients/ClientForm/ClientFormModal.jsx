import { useMediaQuery } from '@mantine/hooks'
import { Modal } from '@mantine/core';

import { RxCross1 } from "react-icons/rx";

import "./ClientForm.css"
import ClientForm from './ClientForm';
function ClientFormModal({ closeModal }) {
    const isMobile = useMediaQuery('(max-width: 50em)');

    return (
        <Modal
            opened={true}
            onClose={() => closeModal()}
            title="Formulario de clientes"
            size="xl"
            centered
            fullScreen={isMobile}
            padding="sm"
            overlayProps={{
                backgroundOpacity: 0.6,
                blur: 5,
            }}
            closeButtonProps={{
                icon: <RxCross1 />,
            }}
        >
            <ClientForm  closeModal={closeModal}/>
        </Modal>
    )
}

export default ClientFormModal
