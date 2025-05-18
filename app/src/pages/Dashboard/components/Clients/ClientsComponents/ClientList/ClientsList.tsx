import { useEffect, useState } from 'react';
import "./ClientsList.css";
import { useAppContext } from '../../../../../../Context/AppContext';

function ClientsList({searchInput}) {
  const {
    modalsHook:{
      openClientModal,
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

  return (
    <div className='clients-list-container'>

      {showClients && showClients.length > 0 ? (
        showClients.map((client) => (
          <div className="client-card" key={client.client_id} onClick={() => openClientModal()}>
            <div className="avatar">{getInitials(client.client_name)}</div>
            <div className="client-info">
              <strong className="name">{client.client_name}</strong>
            </div>
            <div className="client-status">
              <span className="debt">No disponible</span>
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
