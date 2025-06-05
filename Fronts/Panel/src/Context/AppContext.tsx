import React, { useMemo, useContext, createContext, useRef, useEffect } from "react";

import { AppContextValueInterface } from "./Typescript/ContextTypes"

import useModals from "./useModals";
import useAuthentication from "./useAuthentication";
import useClients from "./useClients";
import useDebts from "./useDebts";
import useDelivers from "./useDelivers";
import useFinancialData from "./useFinancialData";
import useResume from "./useResume";
import useBusiness from "./useBusiness";
import useNotifications from "./useNotifications";
import useExpirations from "./useExpirations";

const AppContext = createContext<AppContextValueInterface | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
}

export const AppContextProvider = ({ children }: any) => {
    const [width, setWidth] = React.useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const authHook = useAuthentication()
    const businessHook = useBusiness({})

    const modalsHook = useModals()

    const clientsHook = useClients({
        client_id: modalsHook.selectedClientData.client_id
    })

    const debtsHook = useDebts({
        client_id: modalsHook.selectedClientData.client_id,
        getAllClients: clientsHook.getAllClients,
        business_id: businessHook.businesData?.business_id!
    })

    const deliversHook = useDelivers({
        client_id: modalsHook.selectedClientData.client_id,
        getAllClients: clientsHook.getAllClients,
        business_id: businessHook.businesData?.business_id!

    })

    const financialClientHook = useFinancialData({
        client_id: modalsHook.selectedClientData.client_id,

    })

    const resumeHook = useResume()
    const notificationsHook = useNotifications()

    const expirationsHook = useExpirations({
        business_id: businessHook.businesData?.business_id!
    })

    function getInitials(fullName: string): string {
        const words = fullName.trim().split(/\s+/);
        const initials = words.slice(0, 2).map(word => word[0].toUpperCase());
        return initials.join('');
    }
    const contextValues = useMemo(() => ({
        width,
        modalsHook, authHook, clientsHook, debtsHook,
        deliversHook, financialClientHook,
        resumeHook, getInitials, businessHook,
        notificationsHook, expirationsHook
    }), [
        modalsHook,
        width, authHook, clientsHook, debtsHook,
        deliversHook, financialClientHook,
        resumeHook, businessHook, notificationsHook,
        expirationsHook
    ])



  const alreadyInitialized = useRef(false)
    useEffect(() => {
        if (authHook.loginData && ![null, "", undefined].includes(authHook.loginData.user_id) && !alreadyInitialized.current) {
            alreadyInitialized.current = true
            clientsHook.getAllClients()
            businessHook.getBusinesInfo()
        }
    }, [authHook.loginData])
    return (
        <AppContext.Provider value={
            contextValues
        }>
            {authHook?.validatingSession ? (
                <div className='initLoader-container'>
                    <div className="initLoader"></div>
                </div>
            ) : (children)}
        </AppContext.Provider>
    )
}