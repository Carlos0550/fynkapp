import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react'
import { ClientInterface } from './Typescript/ClientsTypes';

function useModals() {
    const [openedClientModal, { open: openClientModal, close: closeClientModal }] = useDisclosure();
    const [openedAddDeliverModal, { open: openDeliverModal, close: closeDeliverModal }] = useDisclosure();
    const [openedAddDebtModal, { open: openDebtModal, close: closeDebtModal }] = useDisclosure();
    const [openedAddClientModal, { open: openAddClientModal, close: closeAddClientModal }] = useDisclosure();
    const [selectedClientData, setSelectedClientData] = useState<ClientInterface>({
        client_id: "",
        client_name: "",
        manager_client_id: "",
        aditional_client_data: {
            client_dni: "",
            client_email: "",
            client_address: ""
        }
    });

    const clearClientData = () => {
        setSelectedClientData({
            client_id: "",
            client_name: "",
            manager_client_id: "",
            aditional_client_data: {
                client_dni: "",
                client_email: "",
                client_address: ""
            }
        })
    }
    return useMemo(() => ({
        openedClientModal,
        openClientModal,
        closeClientModal,
        openedAddDeliverModal,
        openDeliverModal,
        closeDeliverModal,
        openedAddDebtModal,
        openDebtModal,
        closeDebtModal,
        openedAddClientModal,
        openAddClientModal,
        closeAddClientModal,
        selectedClientData,
        clearClientData,
        setSelectedClientData
    }), [
        openedClientModal,
        openClientModal,
        closeClientModal,
        openedAddDeliverModal,
        openDeliverModal,
        closeDeliverModal,
        openedAddDebtModal,
        openDebtModal,
        closeDebtModal,
        openedAddClientModal,
        openAddClientModal,
        closeAddClientModal,
        selectedClientData,
        clearClientData,
        setSelectedClientData
    ])
}

export default useModals
