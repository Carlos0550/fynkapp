import "./Clients.css"
import { useAppContext } from '../../../../Context/AppContext'
import ClientsList from './ClientsComponents/ClientList/ClientsList'
import ClientModal from '../Modals/ClientsModal/ClientModal'
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
            <ClientModal/>
        </div>
    )
}

export default Clients
