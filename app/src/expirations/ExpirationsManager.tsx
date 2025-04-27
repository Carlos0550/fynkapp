import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./ExpirationsManager.css"

import { Flex, Skeleton, Tabs } from "@mantine/core"
import Expired from './components/Expired/Expired';
import ToOvercome from './components/ToOvercome/ToOvercome';
import { useAppContext } from '../Context/AppContext';
function ExpirationsManager() {
  const [activeTab, setActiveTab] = useState<string | null>('t1');
  const [loadingExpirations, setLoadingExpirations] = useState(true)

  const {
    expirationsHook: {
      getExpirations,
      expirations
    }
  } = useAppContext()

  const handleGetExpirations = useCallback(async () => {
    setLoadingExpirations(true)
    getExpirations()
    setLoadingExpirations(false)
  }, [])


  const alreadyGetted = useRef(false)
  useEffect(() => {
    if (alreadyGetted.current === true) return;
    handleGetExpirations()
    alreadyGetted.current = true
  }, [])
  return (
    <div className='expirations-container'>
      <h3>Sección de vencimientos</h3>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          {loadingExpirations ? (
            <Flex gap={10} mb={5}>
              <Skeleton width={100} height={20} animate={true} />
              <Skeleton width={100} height={20} animate={true} />
            </Flex>
          ) : (
            <>
              <Tabs.Tab value="t1">Vencidos</Tabs.Tab>
              <Tabs.Tab value="t2">Por vencer</Tabs.Tab>
            </>
          )}
        </Tabs.List>

        <Tabs.Panel value="t1">
          {loadingExpirations ? (
            <>
              <Flex gap={10} mt={10} direction={"column"}>
                <Skeleton width={400} height={20} animate={true} />
                <Skeleton width={500} height={20} animate={true} />
                <Skeleton width={500} height={20} animate={true} />
                <Skeleton width={500} height={20} animate={true} />
                <Skeleton width={500} height={20} animate={true} />
                <Skeleton width={500} height={20} animate={true} />
              </Flex>
            </>
          ) : (
            expirations && expirations.expired.length > 0
              ? (
                <>
                  <p className='expirations-title'>Deudas vencidas</p>
                  <Expired expiredData={expirations.expired} />
                </>
              ) : (
                <>
                  <p className='expirations-title'>No hay deudas vencidas</p>
                </>
              )
          )}
        </Tabs.Panel>
        <Tabs.Panel value="t2">
          {expirations && expirations.toOvercome.length > 0
            ? (
              <>
                <p className='expirations-title'>Próximos a vencer dentro de 7 días</p>
                <ToOvercome toOvercome={expirations.toOvercome} />
              </>
            ) : (
              <>
                <p className='expirations-title'>No hay próximos a vencer</p>
              </>
            )}
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default ExpirationsManager