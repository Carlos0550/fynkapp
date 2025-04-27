import { Button, Input, Loader, Skeleton, Table } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useAppContext } from '../../../Context/AppContext'

import "./ClientsFinder.css"
import { useNavigate } from 'react-router-dom'
function ClientsFinder() {
    const navigate = useNavigate()
    const {
        debtsHook: {
            clientsForDebts,
            findClientsForDebts
        },
    } = useAppContext()
    const [searchValue, setSearchValue] = React.useState("")
    const [searching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        setIsSearching(true)
        await findClientsForDebts(searchValue)
        setIsSearching(false)
    }

    useEffect(() => {
        if (searchValue.trim().length > 0) {
            const timer = setTimeout(() => {
                handleSearch()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [searchValue])

    useEffect(()=>{
        if(searchValue === "") handleSearch()
    },[searchValue])
    return (
        <React.Fragment>
            <p>Buscá un cliente por su DNI o Nombre</p>
            <div className="client-finder-container">
                <Input
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder='Ingrese el DNI o Nombre'
                    radius="md"
                    size="sm"
                    style={{
                        maxWidth: "500px"
                    }}
                    leftSection={
                        searching
                            ? <Loader
                                size={"xs"}
                                color='grey'
                                type="bars"
                            />
                            : <FaSearch />
                    }
                    disabled={searching}
                />

                <div className="custom-table-container">
                    <Table
                        className='custom-table'

                    >
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Estado de cuenta</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searching && [...Array(4)].map((_, index) => (
                                <tr key={index}>
                                    <td style={{ padding: ".5rem" }}><Skeleton height={20} my={".5rem"} mx={".5rem"} /></td>
                                    <td style={{ padding: ".5rem" }}><Skeleton height={20} my={".5rem"} mx={".5rem"} /></td>
                                    <td style={{ padding: ".5rem" }}><Skeleton height={20} my={".5rem"} mx={".5rem"} /></td>
                                </tr>
                            ))}
                            {!searching && clientsForDebts && clientsForDebts.length > 0 && clientsForDebts.map((client) => (
                                
                                <tr key={client.client_id} className={client.debt_status === "active" || client.debt_status === "no_debt" ? "active-client" : "debtor-client"}>
                                    <td><p>{client.client_fullname}</p></td>
                                    <td
                                        className='client-debt-status-container'
                                    >
                                      <p 
                                        className={
                                          client.debt_status === "active"
                                            ? "client-debt-status active-client"
                                            : client.debt_status === "no_debt"
                                            ? "client-debt-status no-debt"
                                            : "client-debt-status debtor-client"
                                        }
                                      >
                                        {client.debt_status === "active" ? "Activo" : client.debt_status === "no_debt" ? "Sin deuda" : "Deudor"}
                                      </p>
                                      <p
                                        className={
                                            client.debt_status === "active"
                                              ? "client-debt-amount active-client"
                                              : client.debt_status === "no_debt"
                                              ? "client-debt-amount no-debt"
                                              : "client-debt-amount debtor-client"
                                          }
                                      >
                                        {parseFloat(client.debt_amount).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                                      </p>
                                    </td>

                                    <td>
                                        <Button 
                                            variant="outline" 
                                            color="dark" 
                                            radius="md" 
                                            size="sm"
                                            onClick={() => navigate(`customer-credit?clientID=${client.client_id}`)}
                                            >
                                                Cuenta corriente
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="info-client-table-container">
                        {searchValue.trim().length > 0 && clientsForDebts && clientsForDebts.length === 0 && (
                            <p>No se encontraron resultados</p>
                        )}

                        {!searchValue && clientsForDebts && clientsForDebts.length === 0 && (
                            <p>Lista de clientes vacía</p>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ClientsFinder