import React, { useEffect, useRef, useState } from 'react';

import './clientsManager.css'; 
import { useAppContext } from '../Context/AppContext';

import { FaCity, FaSearch, FaTimes } from 'react-icons/fa';
import { MdDelete, MdEdit, MdEmail, MdMap, MdPhone } from "react-icons/md";
import { PiIdentificationCardFill } from "react-icons/pi";

import { useDisclosure } from '@mantine/hooks';
import ClientForm from './ClientForm/ClientFormModal';
import EditClientModal from './EditClient/EditClientModal.tsx';
import { Popover } from '@mantine/core';

const ClientsManager = () => {
    const [searchFocus, setSearchFocus] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const { getClient, clients, editingClient, setEditingClient, deleteClient } = useAppContext();
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (searchQuery.trim() === "") return;

        const delayDebounce = setTimeout(() => {
            getClient(searchQuery);
        }, 1000); 

        return () => clearTimeout(delayDebounce); 
    }, [searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        document.getElementById("search_client_table").value = ""
        getClient();
    };

    return (
        <div className="clients-manager">
            <h2>Administración de clientes</h2>
            <div className="table-actions">
                        <button className='add-client-table' onClick={open}>
                            Agregar cliente
                        </button>
                        <button className='update-table-btn' onClick={() => getClient()}>Actualizar tabla</button>
                        <div className='search-container'>
                            <input
                                className='search-client-table'
                                id='search_client_table'
                                placeholder='Buscar'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocus(!searchFocus)}
                                onBlur={() => setSearchFocus(!searchFocus)}
                            />
                            {searchFocus ? (
                                <FaTimes className='search-icon' onClick={() => handleClearSearch()} />
                            ) : (
                                <FaSearch className='search-icon' onClick={() => getClient(searchQuery)}/>
                            )}
                            
                        </div>
                        
                    </div>
            <table className="clients-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Datos del cliente</th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {clients && clients.length > 0 && clients.map((client) => (
                        
                        <tr key={client.client_id}>
                            <td>{client.client_fullname}</td>
                            <td>
                                <p><MdEmail/> {client.client_email}</p>
                                <p><MdPhone/> {client.client_phone}</p>
                                {client.client_address && <p><MdMap/> {client.client_address}</p>}
                                {client.client_city && <p><FaCity/> {client.client_city}</p>}
                                {client.client_dni && <p><PiIdentificationCardFill /> {client.client_dni}</p>}
                                
                            </td>
                            <td> 
                                <div className="client-cell-actions">
                                    <button className='edit-client-btn'
                                        onClick={() => setEditingClient({ isEditing: true, clientID: client.client_id })}
                                    ><MdEdit size={18}/> Editar</button>
                                    <Popover>
                                        <Popover.Target>
                                            <button className='delete-client-btn'
                                        
                                            ><MdDelete size={18}/> Eliminar</button>
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                            <p>¿Desea eliminar el cliente {client.client_fullname}?</p>
                                            <button className='delete-client-btn'
                                                onClick={() => deleteClient(client.client_id)}
                                            ><MdDelete size={18}/> Si, eliminar</button>
                                        </Popover.Dropdown>
                                    </Popover>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {opened && <ClientForm closeModal={close} />}
            {editingClient.isEditing && <EditClientModal/>}
        </div>
    );
};

export default ClientsManager;
