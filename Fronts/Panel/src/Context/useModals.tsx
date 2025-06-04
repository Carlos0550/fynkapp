import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react'
import { ClientInterface } from './Typescript/ClientsTypes';
import { EditBusinessData } from './Typescript/BusinessTypes';

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
            client_address: "",
            client_phone: ""
        },
        total_debts: ""
    });
    

    const clearClientData = () => {
        setSelectedClientData({
            client_id: "",
            client_name: "",
            manager_client_id: "",
            aditional_client_data: {
                client_dni: "",
                client_email: "",
                client_address: "",
                client_phone: ""
            },
            total_debts: ""
        })
    }

    const [openedBusinessModal, { open: openBusinessModal, close: closeBusinessModal }] = useDisclosure();
    const [editingBusinessData, setEditingBusinessData] = useState<EditBusinessData>({
        isEditing: false,
        business_id: "",
        business_name: "",
        business_address: "",
        business_phone: ""
    })

    const clearEditBusinessData = () => {
        setEditingBusinessData({
            isEditing: false,
            business_id: "",
            business_name: "",
            business_address: "",
            business_phone: ""
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
        setSelectedClientData,
        openedBusinessModal,
        openBusinessModal,
        closeBusinessModal,
        editingBusinessData, setEditingBusinessData, clearEditBusinessData
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
        setSelectedClientData,
        openedBusinessModal,
        openBusinessModal,
        closeBusinessModal,
        editingBusinessData, setEditingBusinessData, clearEditBusinessData
    ])
}

export default useModals
