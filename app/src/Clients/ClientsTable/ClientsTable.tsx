import React from 'react'
import "./ClientsTable.css"
import { useAppContext } from '../../Context/AppContext'

import { PiIdentificationCardFill } from 'react-icons/pi';
import { MdDelete, MdEdit, MdEmail, MdMap, MdPhone } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { Button, Loader, Popover } from '@mantine/core';
function ClientsTable() {
    const {
        width,
        clientsHook: {
            clients,
            setEditingClient,
            deleteClient,
            deleting,
        }
    } = useAppContext()
    return (
        <div className='clients-table-container'>
            <table className="clients-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Contacto</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {clients && clients.length > 0 && clients.map((client) => (
                        <tr key={client.client_id}>
                            <td>
                                <p><FaUser /> {client.client_fullname}</p>
                                <p><PiIdentificationCardFill /> {client.client_dni ? client.client_dni : "N/A"}</p>
                            </td>
                            <td>
                                    <p><MdEmail /> {client.client_email || "N/A"}</p>
                                    <p><MdPhone /> {client.client_phone || "N/A"}</p>

                                </td>

                            <td >
                                <div className='clients-table-actions-cell'>
                                    <Button variant='outline' onClick={() => setEditingClient({ isEditing: true, clientID: client.client_id })}>
                                        <MdEdit size={18} /> Editar
                                    </Button>
                                    <Popover>
                                        <Popover.Target>
                                            <Button variant='outline' color='red'>
                                                <MdDelete size={18} /> Eliminar
                                            </Button>
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                            <p>¿Desea eliminar el cliente {client.client_fullname}?</p>
                                            <Button  color='red' disabled={deleting} onClick={() => deleteClient(client.client_id)} loading={deleting}>
                                                <MdDelete size={18} /> Si, eliminar
                                            </Button>
                                        </Popover.Dropdown>
                                    </Popover>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ClientsTable
