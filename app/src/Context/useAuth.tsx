import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cleanNotifications, hideNotification, showNotification, updateNotification } from "@mantine/notifications";
import { useLocation, useNavigate } from "react-router-dom";
import { logic_apis } from "../apis";
import { LoginDataInterface } from "./Typescript/UsersTypes";
import { Button } from "@mantine/core";

function useAuth() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [loginData, setLoginData] = useState<LoginDataInterface | null>(null);
    const [count, setCount] = useState(6);
    const [cuentaRegresivaIniciada, setCuentaRegresivaIniciada] = useState(false);
    const notificationId = useRef<string | null>(null);

    const handleCloseSession = useCallback(() => {
        localStorage.removeItem("token");
        setCount(6);
        cleanNotifications();
        notificationId.current = null;
        setCuentaRegresivaIniciada(false);
        navigate("/auth-user");
    }, [navigate, notificationId]);

    const alreadyShownWelcomeNotif = useRef(false);

    const showWelcomeNotification = useCallback((userName: string) => {
        if(alreadyShownWelcomeNotif.current) return;
        alreadyShownWelcomeNotif.current = true;

        showNotification({
            title: "Sesión activa",
            message: `Hola ${userName}, Bienvenido de vuelta`,
            color: "green",
            autoClose: 2000,
            position: "top-right",
        });
    }, [alreadyShownWelcomeNotif]);

    const showSessionExpiredNotification = () => {
        notificationId.current = `session-expire-${Date.now()}`;
        showNotification({
            id: notificationId.current,
            title: "Tu sesión se cerrará en breve",
            message: `Cerrando tu sesión en ${count} segundos`,
            color: "red",
            autoClose: false,
            position: "top-right",
        });
    };

    const showInvalidSessionNotification = () => {
        
        showNotification({
            title: "Sesión inválida o expirada",
            message: "Inicia sesión nuevamente",
            color: "red",
            autoClose: 2000,
            position: "top-right",
        });
        return handleCloseSession()
    };

    const updateCountdownNotification = (remainingTime: number) => {
        if (notificationId.current) {
            updateNotification({
                id: notificationId.current,
                title: "Tu sesión se cerrará en breve",
                message: (
                    <span style={{ display: "flex", flexDirection: "column" }}>
                        <p>Cerrando tu sesión en {remainingTime} segundos</p>
                        <Button onClick={handleCloseSession}>Cerrar ahora</Button>
                    </span>
                ),
                color: "red",
                autoClose: remainingTime * 1000,
                position: "top-right",
            });
        }
    }

   

    useEffect(() => {
        if (cuentaRegresivaIniciada && pathname !== "/auth-user") {
            const interval = setInterval(() => {
                setCount((prevCount) => {
                    if (prevCount <= 1) {
                        handleCloseSession();
                        return 0;
                    }
                    updateCountdownNotification(prevCount - 1);
                    return prevCount - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [cuentaRegresivaIniciada, pathname, count]);

    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem("token");
        if(!token && pathname === "/auth-user") return;
        try {
            const newUrl = new URL(`${logic_apis.users}/verify-token`);
            const response = await fetch(newUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.status === 401) {
                showSessionExpiredNotification();
                setCuentaRegresivaIniciada(true);
                return;
            }

            if (!response.ok) {
                throw new Error(data.msg || "Error desconocido");
            }

            const { user } = data;
            setLoginData(user);

            showWelcomeNotification(user.user_name);

            if (pathname === "/auth-user") {
                navigate("/");
            }
        } catch (error) {
            if (pathname !== "/auth-user") {
                showInvalidSessionNotification();
                navigate("/auth-user");
            }
        }
    }, [
        pathname,
        setLoginData
    ]);

    const alreadyVerified = useRef(false);

    useEffect(()=>{
        if(alreadyVerified.current) return;
        alreadyVerified.current = true;
        verifyToken();
    },[alreadyVerified])

    useEffect(() => {
        if (loginData && Object.keys(loginData).length > 0) {
            const interval = setInterval(() => {
                verifyToken();
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [loginData, verifyToken]);

    return useMemo(
        () => ({
            loginData,
            verifyToken,
        }),
        [loginData, verifyToken]
    );
}

export default useAuth;