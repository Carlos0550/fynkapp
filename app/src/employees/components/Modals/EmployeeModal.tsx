import { Modal } from '@mantine/core'
import React from 'react'
import EmployeeForm from '../Forms/EmployeeForm';

interface EmployeeModalInterface {
  isOpen: boolean;
  close: () => void;
}

function EmployeeModal({ isOpen, close }: EmployeeModalInterface) {
  return (
    <Modal
      title="Agregar un nuevo empleado"
      onClose={close}
      opened={isOpen}
    >
      <EmployeeForm/>
    </Modal>
  )
}

export default EmployeeModal
