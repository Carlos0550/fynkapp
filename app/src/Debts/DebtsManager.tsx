import React, { useEffect, useRef, useState } from 'react'
import "./DebtsManager.css"
import { useParams } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import { ClientsInterface } from '../Context/Typescript/ClientsTypes';
import { showNotification } from '@mantine/notifications';
import ClientInfo from './Components/ClientInfo/ClientInfo';

import { MdOutlineAccountBalanceWallet, MdPayments } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import ClientDebtsFormModal from './Components/ClientDebtsFormModal';
import FinancialDataTableManager from './Components/FinancialDataTableManager/FinancialDataTableManager';
import ClientDeliversFormModal from './Components/ClientDeliversFormModal';

function DebtsManager() {
  const { clientID } = useParams();
  const [clientData, setClientData] = useState<ClientsInterface>({
    client_id: "",
    client_dni: 0,
    client_fullname: "",
    client_email: "",
    client_address: "",
    client_city: "",
    client_phone: 0
  });
  const { isValidUUID, clientsHook, debtsHook } = useAppContext()
  const { getClientData } = clientsHook
  const { getFinancialClientData } = debtsHook

  const [switchMode, setSwitchMode] = useState<"debts" | "payments">("debts")
  

  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeliversFormModal, setShowDeliversFormModal] = useState(false)

  const handleGetClientData = async () => {
    if (!isValidUUID(clientID)) return showNotification({ title: "Error", message: "El ID del cliente no es válido", color: "red", position: "top-right", autoClose: false })
    const client = await getClientData(clientID)
    if (client.client) return setClientData(client.client)
  }

  const alreadyFetched = useRef(false)
  useEffect(() => {
    if (clientID && clientID.trim().split("").length > 0 && !alreadyFetched.current) {
      alreadyFetched.current = true
      handleGetClientData()
      getFinancialClientData()
    }
  }, [clientID])


  return (
    <div className='debts-manager-container'>
      <ClientInfo clientData={clientData} />

      <div className="client-data-actions">
        <button onClick={() => setShowFormModal(true)}><MdOutlineAccountBalanceWallet /> Agregar deuda</button>
        <button onClick={() => setShowDeliversFormModal(true)}><MdPayments /> Registrar pago</button>
        <button><FaTrash /> Vaciar cuenta</button>
      </div>

      <div className="switch-container">
        <label className="switch-label">Ver:</label>
        <label className="switch">
          <input type="checkbox" id="switchMode" 
            onChange={(e) => setSwitchMode(e.target.checked ? "payments" : "debts")}
          />
          <span className="slider"></span>
        </label>
        <label className="switch-label" id="switchLabel">{switchMode ? "Pagos" : "Deudas"}</label>
      </div>

      <FinancialDataTableManager clientData={clientData} tableType={switchMode}/>

      {showFormModal && <ClientDebtsFormModal clientData={clientData} closeModal={() => setShowFormModal(false)}/>}
      {showDeliversFormModal && <ClientDeliversFormModal clientData={clientData} closeModal={() => setShowDeliversFormModal(false)}/>}
    </div>
  )
}

export default DebtsManager