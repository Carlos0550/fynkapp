import React, { useMemo, useContext, createContext, useRef, useEffect } from "react";

import {AppContextValueInterface} from "./Typescript/ContextTypes"

import useModals from "./useModals";
import useAuthentication from "./useAuthentication";
import useClients from "./useClients";

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

    const modalsHook = useModals()
    const clientsHook = useClients()

    const contextValues = useMemo(() => ({
        width,
        modalsHook,authHook, clientsHook
    }), [
        modalsHook,
        width, authHook, clientsHook
    ])

    const alreadyGotClients = useRef(false)
    useEffect(()=>{
        if(authHook.loginData && ![null, "", undefined].includes(authHook.loginData.user_id) && !alreadyGotClients.current){
            alreadyGotClients.current = true
            clientsHook.getAllClients()
        }
    },[authHook.loginData])
    return (
        <AppContext.Provider value={
            contextValues
        }>
            {authHook?.validatingSession ? (
                <div className='initLoader-container'>
                    <div className="initLoader"></div>
                </div>
            ): (children)}
        </AppContext.Provider>
    )
}