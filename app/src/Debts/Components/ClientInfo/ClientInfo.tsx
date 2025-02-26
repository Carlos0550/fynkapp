import React from 'react';
import { ClientsInterface } from '../../../Context/Typescript/ClientsTypes';
import "./clientInfo.css"

interface ClientInfoProps {
  clientData: ClientsInterface;
}

import { AiFillIdcard } from "react-icons/ai";
import { FaCity, FaMailBulk, FaMap, FaPhone, FaUser } from "react-icons/fa";

function ClientInfo({ clientData }: ClientInfoProps) {
  return (
    <div className='client-data-container'>
      {clientData && Object.keys(clientData).length > 0 && (
        <React.Fragment>
          <h2>Cuenta corriente de {clientData.client_fullname}</h2>
          <div className="client-data-box">
            <h3>Datos del cliente</h3>
            <p><FaUser/> Nombre completo: <strong>{clientData.client_fullname}</strong></p>
            <p><AiFillIdcard /> DNI: <strong>{clientData.client_dni}</strong></p>
            <p><FaMailBulk /> Correo: <strong>{clientData.client_email}</strong></p>
            <p><FaMap /> Dirección: <strong>{clientData.client_address}</strong></p>
            <p><FaCity /> Ciudad: <strong>{clientData.client_city}</strong></p>
            <p><FaPhone /> Teléfono: <strong>{clientData.client_phone}</strong></p>
          </div>

          
        </React.Fragment>
      )}
    </div>
  );
}

export default ClientInfo;
