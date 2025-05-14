import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react'

function useModals() {
    const [openedClientModal, { open: openClientModal, close: closeClientModal }] = useDisclosure();
    const [openedAddDeliverModal, { open: openDeliverModal, close: closeDeliverModal }] = useDisclosure();
    const [openedAddDebtModal, { open: openDebtModal, close: closeDebtModal }] = useDisclosure();
    const [openedAddClientModal, { open: openAddClientModal, close: closeAddClientModal }] = useDisclosure();
    
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
        closeAddClientModal
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
        closeAddClientModal
    ])
}

export default useModals
