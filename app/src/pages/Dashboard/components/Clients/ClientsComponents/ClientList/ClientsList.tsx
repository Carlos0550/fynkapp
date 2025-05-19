import { useEffect, useState } from 'react';
import "./ClientsList.css";
import { useAppContext } from '../../../../../../Context/AppContext';
import { showNotification } from '@mantine/notifications';

function ClientsList({searchInput}) {
  const {
    modalsHook:{
      openClientModal,
      setSelectedClientData
    },
    clientsHook:{
      clients
    }
  } = useAppContext();
  
  const [filteredClients, setFilteredClients] = useState([]);

  function getInitials(fullName: string): string {
    const words = fullName.trim().split(/\s+/);
    const initials = words.slice(0, 2).map(word => word[0].toUpperCase());
    return initials.join('');
  }

  const handleLocalSearch = (criteria: string) => {
    return clients.filter(client =>
      client.client_name.toLowerCase().includes(criteria.toLowerCase())
    );
  };

  useEffect(() => {
    if (searchInput.trim().length === 0) {
      setFilteredClients([]);
      return;
    }

    const localResults = handleLocalSearch(searchInput);
    if (localResults.length > 0) {
      setFilteredClients(localResults as any);
    } else {
      setFilteredClients([]);
      console.warn("Buscar en la base de datos:", searchInput);
    }
  }, [searchInput, clients]);

  const showClients = searchInput.length > 0 ? filteredClients : clients;
  const handleOpenModal = (client_id: string) => {
    if(!client_id){
      showNotification({
        color: 'red',
        title: 'Ups, no encontramos el cliente',
        message: 'Intenta recargar esta sección',
        autoClose: 3000,
        position: 'top-right'
      })
      return;
    }
    const selectedClient: any = clients.find((client) => client.client_id === client_id);
    setSelectedClientData(selectedClient);
    openClientModal();
  }
  return (
    <div className='clients-list-container'>

      {showClients && showClients.length > 0 ? (
        showClients.map((client) => (
          <div className="client-card" key={client.client_id} onClick={() => handleOpenModal(client.client_id)}>
            <div className="avatar">{getInitials(client.client_name)}</div>
            <div className="client-info">
              <strong className="name">{client.client_name}</strong>
            </div>
            <div className="client-status">
              <span className="debt">{
                client.total_debts > 0
                ? parseFloat(client.total_debts.toString()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
                : "Sin deudas"
                }</span>
            </div>
          </div>
        ))
      ) : (
        <p className="no-results">No se encontraron resultados.</p>
      )}
    </div>
  );
}

export default ClientsList;
