import React, { useMemo, useContext, createContext, useRef, useEffect } from "react";

import {AppContextValueInterface} from "./Typescript/ContextTypes"

import useModals from "./useModals";
import useAuthentication from "./useAuthentication";

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
    const contextValues = useMemo(() => ({
        width,
        modalsHook,authHook
    }), [
        modalsHook,
        width, authHook
    ])


    return (
        <AppContext.Provider value={
            contextValues
        }>
            {children}
        </AppContext.Provider>
    )
}