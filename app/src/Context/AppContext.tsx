import React, { useEffect, useMemo } from "react";
import { useContext, createContext } from "react";
import useClients from "./useClients";
import useUsers from "./useUsers";
import { useNavigate } from "react-router-dom";

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

    const contextValues = useMemo(() => ({
        ...clientsHook,
        ...usersHook,
        width
    }), [
        clientsHook,
        usersHook,
        width
    ])

    const navigate = useNavigate()

    useEffect(()=>{
        navigate("/auth-user")
    },[navigate])
    return (
        <AppContext.Provider value={
            contextValues
        }>
            {children}
        </AppContext.Provider>
    )
}