import { Box, Modal } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../../../Context/AppContext'
import ClientForm from '../../Clients/ClientsComponents/ClientForm/ClientForm';
import ClientFinancialData from '../../Clients/ClientsComponents/ClientFinancialData/ClientFinancialData';

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
      closeDeliverModal,
      clearClientData
    },
    clientsHook:{
      setEditingClient
    },
    width
  } = useAppContext()
  const [modalOpened, setModalOpened] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const onCloseModal = (): void => {
    setModalOpened(false)
    closeAddClientModal()
    closeClientModal()
    closeDebtModal()
    closeDeliverModal()
    clearClientData()
    setModalTitle("")
    setEditingClient(false)
    return;
  }

  const getModalTitle = () => {
    if(openedAddClientModal) setModalTitle("Agregar cliente")
    if(openedAddDeliverModal) setModalTitle("Agregar entrega")
    if(openedAddDebtModal) setModalTitle("Agregar deuda")
    if(openedClientModal) null
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
      closeOnEscape={false}
      fullScreen={width < 768}
      withCloseButton={openedClientModal ? false : true}
      size="90%"
      padding="sm"
      radius="md"
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 7,
      }}
    >
      <Box style={{ overflowX: 'auto', maxWidth: '100vw' }}>
        {openedAddClientModal && <ClientForm closeModal={onCloseModal}/>}
      {openedAddDeliverModal && <></>}
      {openedAddDebtModal && <></>}
      {openedClientModal && <ClientFinancialData closeModal={onCloseModal}/>}
      </Box>
    </Modal>
  )
}

export default ClientModal
