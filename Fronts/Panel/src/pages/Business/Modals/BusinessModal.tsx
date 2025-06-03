import { Modal } from '@mantine/core'

import { useAppContext } from '../../../Context/AppContext'
import BusinessForm from '../BusinessForm/BusinessForm'

function BusinessModal() {
  const {
    modalsHook: {
      closeBusinessModal,
      openedBusinessModal,
      editingBusinessData,
      clearEditBusinessData,
      
    }
  } = useAppContext()

  const handleCloseThisModal = () => {
    clearEditBusinessData()
    closeBusinessModal()
  }
  return <Modal
    opened={openedBusinessModal}
    onClose={handleCloseThisModal}
    title={editingBusinessData.business_id ? `Editando ${editingBusinessData.business_name}` : "Crear negocio"}
    size="lg"
  >
    <BusinessForm onClose={handleCloseThisModal}/>
  </Modal>
}

export default BusinessModal
