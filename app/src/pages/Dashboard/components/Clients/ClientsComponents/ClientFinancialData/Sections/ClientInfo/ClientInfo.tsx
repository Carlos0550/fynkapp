import { Button, Flex, Skeleton, Text } from '@mantine/core'

import { FaUserEdit, FaUserSlash } from 'react-icons/fa'
import useClientFData from '../../utils/useClientFData'
import { useAppContext } from '../../../../../../../../Context/AppContext'
import { TbReportMoney } from 'react-icons/tb'
import { GiTakeMyMoney } from 'react-icons/gi'

function ClientInfo({setSections}) {
    const {
        gettingClientData,
        clientData,
        aditionalDataLength,
    } = useClientFData()
    const {
            modalsHook: {
                selectedClientData,
            },
            clientsHook: {
                setEditingClient
            }
        } = useAppContext()
    return (
        <div className='financial-container'>

            <div className='financial-client-actions-container'>
                <p className='financial-client-name'>{selectedClientData.client_name}</p>
                <Flex
                    gap={10}
                    justify="center"
                    align="center"
                    mr={30}
                >
                    <Button
                        onClick={() => {
                            setSections("editData")
                            setEditingClient(true)
                        }}
                        disabled={gettingClientData}
                        color='black'
                        variant='outline'
                        leftSection={<FaUserEdit />}
                    >Editar</Button>
                    <Button
                        leftSection={<FaUserSlash />}
                        color='red'
                        variant='outline'
                        onClick={() => setSections("deleteSelf")}
                    >Eliminar</Button>
                </Flex>
            </div>
            {aditionalDataLength > 0 && (
                <div className='financial-client-data'>
                    <p>Datos del cliente</p>
                    {
                        gettingClientData
                            ? (
                                <Flex direction={"column"} gap={10}>
                                    <Skeleton width={550} height={15} animate m={10} />
                                    <Skeleton width={550} height={15} animate m={10} />
                                    <Skeleton width={550} height={15} animate m={10} />
                                    <Skeleton width={550} height={15} animate m={10} />
                                </Flex>
                            )
                            : (
                                <Flex direction={"column"} gap={10} >
                                    {clientData.aditional_client_data.client_dni && (
                                        <p>DNI: {clientData.aditional_client_data.client_dni}</p>
                                    )}
                                    {clientData.aditional_client_data.client_email && (
                                        <p>Email: {clientData.aditional_client_data.client_email}</p>
                                    )}
                                    {clientData.aditional_client_data.client_address && (
                                        <p>Dirección: {clientData.aditional_client_data.client_address}</p>
                                    )}
                                </Flex>
                            )
                    }
                </div>

            )}
            <div className='financial-client-data'>
                <div className='financial-client-data-micelaneous'>
                    <Flex
                        gap={10}
                        direction={"column"}
                        justify="center"
                        align="center"
                        wrap="wrap"
                    >
                        <Text fw={900} size='xl'>Información financiera</Text>
                        <p>Saldo total:
                            {
                                selectedClientData.total_debts > 0
                                    ? parseFloat(selectedClientData.total_debts.toString()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
                                    : " Sin deudas"
                            }
                        </p>
                    </Flex>
                    <Flex
                        gap={10}
                        justify="center"
                        align="center"
                        wrap="wrap"
                    >
                        <Button disabled={gettingClientData} leftSection={<TbReportMoney size={25} />} color='black' variant='outline' onClick={() => setSections("newDebt")}>Agregar deuda</Button>
                        <Button disabled={gettingClientData} leftSection={<GiTakeMyMoney size={25} />} color='black' onClick={() => setSections("newdeliver")}>Agregar entrega</Button>
                    </Flex>
                </div>
            </div>
        </div>
    )
}

export default ClientInfo
