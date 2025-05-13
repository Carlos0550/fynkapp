import React, { useMemo, useContext, createContext, useRef } from "react";
import useClients from "./useClients";
import useUsers from "./useUsers";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useDebts from "./useDebts";

import {AppContextValueInterface} from "./Typescript/ContextTypes"
import useDelivers from "./useDelivers";
import useEmployeers from "./useEmployeers";
import useBusiness from "./useBusiness";
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

    React.useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function isValidUUID(uuid:string) {
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return regex.test(uuid);
      }

    const authHook = useAuth()

    const { verifyToken, loginData, showSessionExpiredNotification, setCuentaRegresivaIniciada } = authHook
    
    const clientsHook = useClients(verifyToken, loginData)
    
    const usersHook = useUsers()
    
    const debtsHook = useDebts(setCuentaRegresivaIniciada, showSessionExpiredNotification)

    const { getFinancialClientData } = debtsHook
    
    const deliversHook = useDelivers(setCuentaRegresivaIniciada, showSessionExpiredNotification, getFinancialClientData)

    const employeersHook = useEmployeers(loginData)
    const businessHook = useBusiness(loginData)
    const expirationsHook = useExpirations()
    const contextValues = useMemo(() => ({
        clientsHook,
        usersHook,
        authHook,
        debtsHook,
        deliversHook,
        width,
        isValidUUID,
        employeersHook,
        businessHook,
        expirationsHook
    }), [
        clientsHook,
        usersHook,
        authHook,
        debtsHook,
        deliversHook,
        employeersHook,
        businessHook,
        expirationsHook
    ])


    return (
        <AppContext.Provider value={
            contextValues
        }>
            {children}
        </AppContext.Provider>
    )
}