import { useAppContext } from '../../../../../../Context/AppContext'
import { IoIosCloseCircle } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { FaUserSlash } from "react-icons/fa6";
import "./ClientFinancialData.css"
import { Button, Flex, Skeleton } from '@mantine/core';
import { TbReportMoney } from "react-icons/tb";
import { GiTakeMyMoney } from "react-icons/gi";

import useClientFData from './utils/useClientFData';
import React, { useEffect, useState } from 'react';
import EditData from './Sections/EditData/EditData';

type FinancialClientSections = 'newDebt' | "newdeliver" | "editData" | "deleteSelf" | "home"

function ClientFinancialData({ closeModal }) {
    const {
        modalsHook: {
            selectedClientData,
        },
        clientsHook: {
            setEditingClient
        }
    } = useAppContext()

    const {
        gettingClientData,
        clientData,
        aditionalDataLength,
    } = useClientFData()
    const [sections, setSections] = useState<FinancialClientSections>("home")
    return (
        <React.Fragment>
            <IoIosCloseCircle
                size={30}
                className='financial-close-icon'
                onClick={() => closeModal()}
            />
            {
                sections === "home"
                    ? (
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
                                    <div>
                                        <p>Información financiera</p>
                                        <p>Saldo total: $0</p>
                                    </div>
                                    <div className='financial-client-data-actions'>
                                        <Button leftSection={<TbReportMoney size={25} />} color='black' variant='outline'>Agregar deuda</Button>
                                        <Button leftSection={<GiTakeMyMoney size={25} />} color='black'>Agregar entrega</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : sections === "editData"
                        ? (<EditData closeModal={closeModal} setSections={setSections} />)
                        : <></>
            }
        </React.Fragment>
    )
}

export default ClientFinancialData
