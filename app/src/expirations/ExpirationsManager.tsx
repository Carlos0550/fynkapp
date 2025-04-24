import React, { useState } from 'react'
import "./ExpirationsManager.css"

import { Tabs } from "@mantine/core"
import Expired from './components/Expired/Expired';
import ToOvercome from './components/ToOvercome/ToOvercome';
function ExpirationsManager() {
  const [activeTab, setActiveTab] = useState<string | null>('t1');
  const [loadingExpirations, setLoadingExpirations] = useState(false)
  return (
    <div className='expirations-container'>
      <h3>Sección de vencimientos</h3>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="t1">Vencidos</Tabs.Tab>
          <Tabs.Tab value="t2">Por vencer</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="t1">
          <p className='expirations-title'>Deudas vencidas</p>
          <Expired />
        </Tabs.Panel>
        <Tabs.Panel value="t2">
          <p className='expirations-title'>Próximos a vencer dentro de 7 días</p>

          <ToOvercome />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default ExpirationsManager