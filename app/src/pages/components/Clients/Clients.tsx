import React from 'react'
import "./Clients.css"
import { useAppContext } from '../../../Context/AppContext'
import ClientsList from './ClientsComponents/ClientList/ClientsList'
function Clients({searchInput, setSearchInput}) {
    const {
        clientsHook: {
            clients
        }
    } = useAppContext()
    return (
        <div className='clients-container'>
            <p className='clients-title'>Clientes ({clients && clients.length})</p>
            <ClientsList searchInput={searchInput} setSearchInput={setSearchInput}/>
        </div>
    )
}

export default Clients
