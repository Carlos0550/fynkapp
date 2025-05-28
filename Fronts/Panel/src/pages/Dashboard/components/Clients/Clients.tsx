import "./Clients.css"
import { useAppContext } from '../../../../Context/AppContext'
import ClientsList from './ClientsComponents/ClientList/ClientsList'

function Clients({searchInput}) {
    const {
        clientsHook:{
            clients
        }
    } = useAppContext()
    return (
        <div className='clients-container'>
            <p className='clients-title'>Clientes ({clients && clients.length})</p>
            <ClientsList searchInput={searchInput}/>
        </div>
    )
}

export default Clients
