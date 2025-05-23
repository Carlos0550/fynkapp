import React, { useEffect, useState } from 'react'
import "./Layout.css"
import Sidebar from './Sidebar/Sidebar'
import { useAppContext } from '../Context/AppContext'
import { Flex, Skeleton } from '@mantine/core'
function Layout({ content }) {
  const [gettingClients] = useState(false)
  const {
    width,
  } = useAppContext()
  
  const [mobileExtended, setMobileExtended] = useState(false)
  
  useEffect(() => {
    if (width >= 768) {
      setMobileExtended(false)
    }
  }, [width])

  return (
    <div className='layout-container'>
      <div className={`layout-sidebar ${mobileExtended ? 'extended' : 'layout-sidebar'}`}>
        {gettingClients 
          ? (
            <Flex direction="column" gap="md">
              <Skeleton width={100} height={20} style={{margin: "0 auto"}}/>
              <Skeleton width={200} height={20}/>
              <Skeleton width={200} height={20}/>
              <Skeleton width={200} height={20}/>
              <Skeleton width={200} height={20}/>
              <Skeleton width={200} height={20}/>
              <Skeleton width={200} height={20}/>
              <Skeleton width={200} height={5} m={10}/>
              <Skeleton width={200} height={20}/>
              <Skeleton width={200} height={20}/>
            </Flex>
          )
          : (
            <Sidebar mobileExtended={mobileExtended} setMobileExtended={setMobileExtended}/>
          )
        }
      </div>
      <div className='layout-content'>
        {content}
      </div>
    </div>
  )
}

export default Layout
