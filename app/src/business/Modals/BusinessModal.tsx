import { Modal } from '@mantine/core'
import React from 'react'
import { useAppContext } from '../../Context/AppContext'
import BusinessForm from '../BusinessForm/BusinessForm'


function BusinessModal() {
    const {
        businessHook:{
            modalContext,
            openedBusinessModal,
            closeBusinessModal
        }
    } = useAppContext()
    return (
        <Modal
            opened={openedBusinessModal}
            onClose={closeBusinessModal}
            title={
                modalContext === "edit"
                    ? "Editar negocio"
                    : "Agregar negocio"
            }
            padding="sm"
            overlayProps={{
                backgroundOpacity: 0.6,
                blur: 5,
            }}
            size={"xl"}
        >
            <BusinessForm/>
        </Modal>
    )
}

export default BusinessModal
