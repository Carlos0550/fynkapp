import React from 'react'
import { Button } from '@mantine/core'
import "./BusinessManager.css"

import { useAppContext } from '../Context/AppContext'
import BusinessModal from './Modals/BusinessModal'
function BusinessManager() {
  const {
    businessHook:{
      openedBusinessModal,
      openBusinessModal,
      setModalContent
    }
  } = useAppContext()

  const handleOpenModal = () => {
    setModalContent("create")
    openBusinessModal()
  }
  return (
    <div className='business-manager-container'>
      
      <div className='business-manager-actions'>
      <h3>Gestión de sucursales</h3>
        <Button
          color='dark'
          onClick={handleOpenModal}
        >Agregar Sucursal</Button>
      </div>
      <div className="business-manager-table-container"></div>
      <BusinessModal />
    </div>
  )
}

export default BusinessManager
