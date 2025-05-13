import React, { useEffect, useState } from 'react'
import "./Management.css"
import { Tabs } from '@mantine/core'
import EmployeesManager from '../employees/EmployeesManager';
import BusinessManager from '../business/BusinessManager';

type TabValue = 'employeesManagement' | 
'rolesManagement' | 
'businessManagement';

function Management() {
    const [activeTab, setActiveTab] = useState<TabValue>("employeesManagement")
    
  return (
    <React.Fragment>
        <h2>Gestión general</h2>
        <Tabs value={activeTab} onChange={(val)=> setActiveTab(val as TabValue)}>
          <Tabs.List>
            <Tabs.Tab value="employeesManagement">Empleados</Tabs.Tab>
            <Tabs.Tab value="businessManagement">Sucursales</Tabs.Tab>
            <Tabs.Tab value="rolesManagement">Roles</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="employeesManagement">
            <EmployeesManager/>
          </Tabs.Panel>

          <Tabs.Panel value="businessManagement">
            <BusinessManager/>
          </Tabs.Panel>

          <Tabs.Panel value="rolesManagement">
            <h3>Gestión de roles</h3>
          </Tabs.Panel>
        </Tabs>
    </React.Fragment>
  )
}

export default Management
