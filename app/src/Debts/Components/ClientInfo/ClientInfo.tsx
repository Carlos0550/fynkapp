import React from 'react';
import { ClientsInterface } from '../../../Context/Typescript/ClientsTypes';
import "./clientInfo.css"

interface ClientInfoProps {
  clientData: ClientsInterface;

}

import { AiFillIdcard } from "react-icons/ai";
import { FaMailBulk, FaPhone, FaUser } from "react-icons/fa";
import { useAppContext } from '../../../Context/AppContext';
import { Flex, Skeleton } from '@mantine/core';

function ClientInfo({ clientData }: ClientInfoProps) {
  const {
    debtsHook:{
      gettingClientData
    }
  } = useAppContext()
  return (
    <div className='client-data-container'>
      {!gettingClientData && clientData && Object.keys(clientData).length > 0 && (
        <React.Fragment>
          <h2>Cuenta corriente de {clientData.client_fullname}</h2>
          <div className="client-data-box">
            <h3>Datos del cliente</h3>
            <p><FaUser/> Nombre completo: <strong>{clientData.client_fullname}</strong></p>
            <p><AiFillIdcard /> DNI: <strong>{clientData.client_dni}</strong></p>
            <p><FaMailBulk /> Correo: <strong>{clientData.client_email || "N/A"}</strong></p>
            <p><FaPhone /> Teléfono: <strong>{clientData.client_phone || "N/A"}</strong></p>
          </div>

          
        </React.Fragment>
      )}

      {gettingClientData && (
        <Flex direction={"column"} gap={10}>
          <Skeleton width={500} height={20}/>
          <Skeleton width={500} height={20}/>
          <Skeleton width={500} height={20}/>
          <Skeleton width={500} height={20}/>
        </Flex>
      )}
    </div>
  );
}

export default ClientInfo;
