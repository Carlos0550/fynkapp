import React from 'react'
import "./EmployeesManager.css"
import { Button } from '@mantine/core'
import EmployeeTable from './components/EmployeesTable/EmployeeTable'
import EmployeeModal from './components/Modals/EmployeeModal'
import { useDisclosure } from '@mantine/hooks'

function EmployeesManager() {
  const [openedEmployeeModal, { open: openEmployeeModal1, close: closeEmployeeModal1 }] = useDisclosure();

  return (
    <div className='employees-manager-container'>
      <div className="employees-title">
        <h3>Gestión de empleados</h3>
        <Button c={"white"} color='dark' onClick={openEmployeeModal1}>Agregar empleado</Button>
      </div>
      <EmployeeTable />
      <EmployeeModal isOpen={openedEmployeeModal} close={closeEmployeeModal1} />
    </div>
  )
}

export default EmployeesManager
