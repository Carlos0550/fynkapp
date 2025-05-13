import React from 'react'
import { useAppContext } from '../Context/AppContext'
import "./Dashboard.css"
import InitLoader from './components/PageLaders/InitLoader'
import { Input } from '@mantine/core'
import { FaSearch } from "react-icons/fa";
function Dashboard() {
    const {
        clientsHook:{
            gettingClients
        }
    } = useAppContext()

    if (gettingClients) {
        return (
            <InitLoader/>
        )
    }
  return (
    <div className='dashboard-container'>
      <div className="dashboard-search-container">
        <Input 
            placeholder='Buscar cliente'
            className='dashboard-search-input'
            leftSection={<FaSearch/>}
            radius={"md"}
            size='md'
        />
      </div>
    </div>
  )
}

export default Dashboard
