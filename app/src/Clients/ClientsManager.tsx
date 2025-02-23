import React, { useEffect, useRef, useState } from 'react';

import './clientsManager.css'; 
import { useAppContext } from '../Context/AppContext';

import { FaSearch, FaTimes } from 'react-icons/fa';
import { MdDelete, MdEdit } from "react-icons/md";

import { useDisclosure } from '@mantine/hooks';
import ClientForm from './ClientForm/ClientForm';

const ClientsManager = () => {
    const [searchFocus, setSearchFocus] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const { getClient, clients } = useAppContext();
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


    // useEffect(() => {
    //     if (!isAuthenticated) return;
    //     getClient()
    // }, [isAuthenticated])

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
                        <th>Datos de contacto</th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {clients && clients.length > 0 && clients.map((client) => (
                        <tr key={client.client_id}>
                            <td>{client.client_fullname}</td>
                            <td>
                                <p>{client.client_email}</p>
                                <p>{client.client_phone}</p>
                                
                            </td>
                            <td> 
                                <div className="client-cell-actions">
                                    <button className='edit-client-btn'><MdEdit size={18}/> Editar</button>
                                    <button className='delete-client-btn'><MdDelete size={18}/> Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {opened && <ClientForm closeModal={close} />}
        </div>
    );
};

export default ClientsManager;
