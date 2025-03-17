import React, { useEffect, useState } from 'react';
import "./DebtsManager.css";
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import { ClientsInterface } from '../Context/Typescript/ClientsTypes';
import { showNotification } from '@mantine/notifications';
import ClientInfo from './Components/ClientInfo/ClientInfo';
import FinancialDataTableManager from './Components/FinancialDataTableManager/FinancialDataTableManager';
import ClientsFinder from './Components/ClientsFinder/ClientsFinder';
import { ClientActions } from './Components/ClientActions/ClientActions';
import { SwitchTabs } from './Components/SwitchTabs/SwitchTabs';
import {ModalsManager} from './Components/ModalsManager/ModalsManager';

function DebtsManager() {
  const [searchParams] = useSearchParams();
  const clientID = searchParams.get("clientID");
  const [clientData, setClientData] = useState<ClientsInterface>({
    client_id: "",
    client_dni: 0,
    client_fullname: "",
    client_email: "",
    client_address: "",
    client_city: "",
    client_phone: 0
  });
  const { isValidUUID, clientsHook, debtsHook } = useAppContext();
  const { getClientData } = clientsHook;
  const { getFinancialClientData, financialClientData: { totalDebtAmount, clientDebts }, cancelDebt } = debtsHook;

  const [switchMode, setSwitchMode] = useState<"debts" | "payments" | "history">("debts");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeliversFormModal, setShowDeliversFormModal] = useState(false);

  const handleGetClientData = async () => {
    if (!isValidUUID(clientID || "")) return showNotification({ title: "Error", message: "El ID del cliente no es válido", color: "red", position: "top-right", autoClose: false });
    const client = await getClientData(clientID || "");
    if (client.client) return setClientData(client.client);
  };

  useEffect(() => {
    if (clientID && clientID.trim().split("").length > 0) {
      handleGetClientData();
      getFinancialClientData();
    }
  }, [clientID]);

  return (
    <React.Fragment>
      <Routes>
        <Route path={"/"} element={
          <React.Fragment>
            <h2>Cuentas Corrientes</h2>
            <ClientsFinder />
          </React.Fragment>
        } />

        <Route path='customer-credit' element={
          <React.Fragment>
            <div className='debts-manager-container'>
              <ClientInfo clientData={clientData} />

              <ClientActions
                totalDebtAmount={totalDebtAmount}
                clientDebts={clientDebts}
                onAddDebt={() => setShowFormModal(true)}
                onRegisterPayment={() => setShowDeliversFormModal(true)}
                onClearAccount={cancelDebt}
              />

              <SwitchTabs onChange={(value) => setSwitchMode(value)} />

              <FinancialDataTableManager clientData={clientData} tableType={switchMode} />

              <ModalsManager
                clientData={clientData}
                showFormModal={showFormModal}
                showDeliversFormModal={showDeliversFormModal}
                onCloseFormModal={() => setShowFormModal(false)}
                onCloseDeliversFormModal={() => setShowDeliversFormModal(false)}
              />
            </div>
          </React.Fragment>
        } />
      </Routes>
    </React.Fragment>
  );
}

export default DebtsManager;