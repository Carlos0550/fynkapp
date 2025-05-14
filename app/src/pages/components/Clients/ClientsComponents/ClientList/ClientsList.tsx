import React, { useEffect, useState } from 'react';
import "./ClientsList.css";
import { useAppContext } from '../../../../../Context/AppContext';
import { Button, Flex, Popover, PopoverTarget } from '@mantine/core';
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
function ClientsList({searchInput}) {
  const {
    clientsHook: { 
      clients
    },
    modalsHook:{
      openClientModal,
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
      client.client_fullname.toLowerCase().includes(criteria.toLowerCase())
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
            <div className="avatar">{getInitials(client.client_fullname)}</div>
            <div className="client-info">
              <strong className="name">{client.client_fullname}</strong>
              <span className="dni">DNI: {client.client_dni}</span>
            </div>
            <div className="client-status">
              <span className="debt">No disponible</span>
              <Popover position="left-start" arrowSize={10} arrowOffset={10} withArrow>
                <PopoverTarget><span className="more">...</span></PopoverTarget>
                <Popover.Dropdown >
                  <Flex justify={"center"} align={"center"} gap={10}>
                    <Button size='xs' color='red' variant='outline'><MdDeleteOutline size={18}/></Button>
                    <Button size='xs' variant='outline'><MdEdit size={18}/></Button>
                  </Flex>
                </Popover.Dropdown>
              </Popover>
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
