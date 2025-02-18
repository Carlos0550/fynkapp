import React, { useMemo } from "react";
import { useContext, createContext } from "react";
import useClients from "./useClients";

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

    // React.useEffect(() => {
    //     console.log(width)
    // },[width])
    const clientsHook = useClients()

    const contextValues = useMemo(() => ({
        ...clientsHook,
        width
    }), [
        clientsHook,
        width
    ])
    return (
        <AppContext.Provider value={
            contextValues
        }>
            {children}
        </AppContext.Provider>
    )
}