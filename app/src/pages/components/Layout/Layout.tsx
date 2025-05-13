import React, { useEffect, useState } from 'react'
import "./Layout.css"
import Sidebar from '../Sidebar/Sidebar'
import { useAppContext } from '../../../Context/AppContext'
function Layout({ content }) {
  
  const {
    width
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
        <Sidebar mobileExtended={mobileExtended} setMobileExtended={setMobileExtended}/>
      </div>
      <div className='layout-content'>
        {content}
      </div>
    </div>
  )
}

export default Layout
