import React, { useEffect, useMemo, useContext, createContext, useRef } from "react";
import useClients from "./useClients";
import useUsers from "./useUsers";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const AppContext = createContext({});

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

    const clientsHook = useClients()
    const usersHook = useUsers()
    const authHook = useAuth()

    const alreadyVerified = useRef(false)

    useEffect(()=>{
        if(alreadyVerified.current) return
        alreadyVerified.current = true
        authHook.verifyToken()
    },[])

    const contextValues = useMemo(() => ({
        ...clientsHook,
        ...usersHook,
        ...authHook,
        width
    }), [
        clientsHook,
        usersHook,
        authHook,
        width
    ])

    const navigate = useNavigate()
    return (
        <AppContext.Provider value={
            contextValues
        }>
            {children}
        </AppContext.Provider>
    )
}