import React, { useMemo, useContext, createContext, useRef } from "react";
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

    const authHook = useAuth()
    const clientsHook = useClients(authHook.verifyToken, authHook.loginData)
    const usersHook = useUsers()

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