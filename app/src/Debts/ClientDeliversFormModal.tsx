import React from 'react'
import { ClientsInterface } from '../Context/Typescript/ClientsTypes'

interface ModalProps {
    clientData: ClientsInterface
    closeModal: () => void
    isEditing?: boolean
}

function ClientDeliversFormModal() {
  return (
    <div>ClientDeliversFormModal</div>
  )
}

export default ClientDeliversFormModal