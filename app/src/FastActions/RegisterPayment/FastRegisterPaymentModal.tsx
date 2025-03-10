import { Modal } from '@mantine/core'
import React from 'react'
import FastRegisterPaymentForm from './FastRegisterPaymentForm'

interface FormModal{
  closeModal: () => void   
}
function FastRegisterPaymentModal({closeModal}: FormModal) {
  return (
    <Modal
        onClose={() => closeModal()}
        opened={true}
        title="Registrar Pago"
    >
        <FastRegisterPaymentForm closeModal={closeModal}/>
    </Modal>
  )
}

export default FastRegisterPaymentModal