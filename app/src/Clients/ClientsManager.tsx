import React, { useEffect, useState } from 'react';
import './clientsManager.css';
import { useAppContext } from '../Context/AppContext';
import {  FaSearch, FaTimes } from 'react-icons/fa';

import { useDisclosure } from '@mantine/hooks';
import ClientForm from './ClientForm/ClientFormModal';
import EditClientModal from './EditClient/EditClientModal';
import { Flex, Skeleton } from '@mantine/core';
import ClientsTable from './ClientsTable/ClientsTable';

const ClientsManager = () => {
    const [searchFocus, setSearchFocus] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const { clientsHook } = useAppContext();
    const { getClient, editingClient, gettingClients } = clientsHook
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (searchQuery.trim() === '') return;

        const delayDebounce = setTimeout(() => {
            getClient(searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, getClient]);

    const handleClearSearch = () => {
        setSearchQuery('');
        document.getElementById('search_client_table').value = '';
        getClient();
    };

    return (
        <React.Fragment>
            {gettingClients ? (
                <Flex gap={10}>
                    <Flex direction={"column"} gap={10}>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                        <Skeleton animate={true} width={50} height={20}/>
                    </Flex>

                    <Flex direction={"column"} gap={10}>
                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>

                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>
                        <Skeleton animate={true} width={500} height={20}/>
                    </Flex>

                    <Flex direction={"column"} gap={10}>
                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>

                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>
                        <Skeleton animate={true} width={300} height={20}/>
                    </Flex>
                </Flex>
            ) : (
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
                                onFocus={() => setSearchFocus(true)}
                                onBlur={() => setSearchFocus(false)}
                            />
                            {searchFocus ? (
                                <FaTimes className='search-icon' onClick={handleClearSearch} />
                            ) : (
                                <FaSearch className='search-icon' onClick={() => getClient(searchQuery)} />
                            )}
                        </div>
                    </div>
                    <ClientsTable/>
                </div>
            )}
            {opened && <ClientForm closeModal={close} />}
            {editingClient && editingClient.isEditing && <EditClientModal />}
        </React.Fragment>

    );
};

export default ClientsManager;
