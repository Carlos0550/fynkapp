import { Modal } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../../Context/AppContext'
import ClientForm from './ClientForm/ClientForm';
import ClientPayments from './ClientPayments/ClientPayments';
import ClientDebtForm from './ClientDebtForm/ClientDebtForm';

function ClientModal() {
  const {
    modalsHook:{
      openedAddClientModal,
      openedAddDeliverModal,
      openedAddDebtModal,
      openedClientModal,

      closeAddClientModal,
      closeClientModal,
      closeDebtModal,
      closeDeliverModal
    }
  } = useAppContext()
  const [modalOpened, setModalOpened] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const onCloseModal = (): void => {
    setModalOpened(false)
    closeAddClientModal()
    closeClientModal()
    closeDebtModal()
    closeDeliverModal()
    return;
  }

  const getModalTitle = () => {
    if(openedAddClientModal) setModalTitle("Agregar cliente")
    if(openedAddDeliverModal) setModalTitle("Agregar entrega")
    if(openedAddDebtModal) setModalTitle("Agregar deuda")
    if(openedClientModal) setModalTitle("Información del cliente")
  }

  useEffect(()=>{
    if(
      openedAddClientModal ||
      openedAddDeliverModal ||
      openedAddDebtModal ||
      openedClientModal
    ){
      getModalTitle()
      setModalOpened(true)
    }
  },[
    openedAddClientModal,
    openedAddDeliverModal,
    openedAddDebtModal,
    openedClientModal
  ])
  return (
    <Modal
      opened={modalOpened}
      onClose={() => onCloseModal()}
      title={modalTitle}
      size="xl"
      padding="sm"
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 5,
      }}
    >
      {openedAddClientModal && <ClientForm closeModal={onCloseModal}/>}
      {openedAddDeliverModal && <ClientPayments closeModal={onCloseModal}/>}
      {openedAddDebtModal && <ClientDebtForm closeModal={onCloseModal}/>}
    </Modal>
  )
}

export default ClientModal
