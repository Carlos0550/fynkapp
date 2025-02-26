import React, { useEffect, useRef, useState } from 'react'
import "./DebtsManager.css"
import { useParams } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import { ClientsInterface } from '../Context/Typescript/ClientsTypes';
import { showNotification } from '@mantine/notifications';
import ClientInfo from './Components/ClientInfo/ClientInfo';
import ClientDebtsTable from './Components/DebtTable/ClientDebtsTable';
import { MdOutlineAccountBalanceWallet, MdPayments } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import ClientDebtsFormModal from './Components/ClientDebtsFormModal';

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
  const [switchMode, setSwitchMode] = useState(false)
  
  const switchRef = useRef<HTMLInputElement>(null)

  const [showFormModal, setShowFormModal] = useState(false)

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


  useEffect(() => {
    if (switchRef.current) {
      document.addEventListener("change", () => {
        if (switchRef.current) {
          setSwitchMode(switchRef.current.checked)
        }
      })

      return () => {
        document.removeEventListener("change", () => {
          if (switchRef.current) {
            setSwitchMode(switchRef.current.checked)
          }
        })
      }
    }
  }, [switchRef])

  return (
    <div className='debts-manager-container'>
      <ClientInfo clientData={clientData} />

      <div className="client-data-actions">
        <button onClick={() => setShowFormModal(true)}><MdOutlineAccountBalanceWallet /> Agregar deuda</button>
        <button><MdPayments /> Registrar pago</button>
        <button><FaTrash /> Vaciar cuenta</button>
      </div>

      <div className="switch-container">
        <label className="switch-label">Ver:</label>
        <label className="switch">
          <input type="checkbox" id="switchMode" ref={switchRef} />
          <span className="slider"></span>
        </label>
        <label className="switch-label" id="switchLabel">{switchMode ? "Pagos" : "Deudas"}</label>
      </div>

      {switchMode
        ? (<p>Tabla aún en desarrollo</p>)
        : <ClientDebtsTable clientData={clientData} />
      }

      {showFormModal && <ClientDebtsFormModal clientData={clientData} closeModal={() => setShowFormModal(false)}/>}
    </div>
  )
}

export default DebtsManager