import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CreateUserForm, LoginData, LoginUserForm } from '../Context/Typescript/AuthenticationTypes';
import { showNotification } from '@mantine/notifications';
import { logic_apis } from '../apis';
import { useLocation, useNavigate } from 'react-router-dom';

function useAuthentication() {
    const navigate = useNavigate();
    const location = useLocation();

    const loginDataRef = useRef<LoginData>({ user_email: '', user_id: '', user_name: '', business_data: null });

    const [loginData, _setLoginData] = useState<LoginData>(loginDataRef.current);

    const setLoginData = useCallback((data: LoginData) => {
        loginDataRef.current = data;
        _setLoginData(data);
    }, []);

    const loginUser = useCallback(async (formValues: LoginUserForm): Promise<void> => {
        showNotification({
            color: "yellow",
            title: "Iniciando sesión",
            message: "Aguarde un segundo...",
            autoClose: 2000,
            position: "top-right"
        });

        try {
            const response = await fetch(logic_apis.authentication + "/login-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
            });

            if (!response.ok) {
                if (response.status === 404) throw new Error("El correo ingresado no es válido o no se encuentra registrado.");
                if (response.status === 401) throw new Error("La contraseña ingresada es incorrecta.");
                const errorBody = await response.text();
                throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
            }

            const responseJson = await response.json();

            showNotification({
                color: "green",
                title: `Bienvenido, ${responseJson.manager_name}`,
                message: "",
                autoClose: 2500,
                position: "top-right"
            });

            setLoginData({
                user_email: responseJson.manager_email,
                user_id: responseJson.manager_id,
                user_name: responseJson.manager_name,
                business_data: responseJson.business_data ? JSON.parse(responseJson.business_data) : null
            });

            localStorage.setItem("token", responseJson.token);
            navigate("/");
            return;
        } catch (error) {
            console.error("Error en loginUser:", error);
            if (error instanceof TypeError) {
                showNotification({
                    color: "red",
                    title: "Error de conexión",
                    message: "Verifique su conexión a internet, o espere un momento y vuelva a intentarlo",
                    autoClose: 4500,
                    position: "top-right"
                })
                return
            };
            showNotification({
                color: "red",
                title: "Error al iniciar sesión",
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 4500,
                position: "top-right"
            });
            setLoginData({ user_email: '', user_id: '', user_name: '', business_data: null });
            localStorage.removeItem("token");
            return;
        }
    }, [navigate, setLoginData]);

    const registerUser = useCallback(async (formValues: CreateUserForm): Promise<boolean> => {
        showNotification({
            color: "yellow",
            title: "Registrando usuario",
            message: "Aguarde un segundo...",
            autoClose: 2000,
            position: "top-right"
        });

        try {
            const response = await fetch(logic_apis.authentication + "/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.msg || `Error al registrar usuario: ${response.statusText}`);
            }

            showNotification({
                color: "green",
                title: `Te damos la bienvenida a Fynkapp, ${responseData.manager_name}`,
                message: "Gracias por registrarte, revisa tu correo para activar tu cuenta",
                autoClose: 5000,
                position: "top-right"
            });
            return true;
        } catch (error) {
            console.error("Error en registerUser:", error);
            if (error instanceof TypeError) {
                showNotification({
                    color: "red",
                    title: "Error de conexión",
                    message: "Verifique su conexión a internet, o espere un momento y vuelva a intentarlo",
                    autoClose: 4500,
                    position: "top-right"
                })
                return false
            };

            showNotification({
                color: "red",
                title: "Error al registrar usuario",
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 4500,
                position: "top-right"
            });

            return false;
        }
    }, []);

    const notificateUserWithoutSession = useCallback(() => {
        return showNotification({
            color: "red",
            title: "Sesión no válida o expirada",
            message: "Por favor inicia sesión nuevamente",
            autoClose: 4000,
            position: "top-right",
        });
    }, []);

    const [validatingSession, setValidatingSession] = useState(false);
    const alreadyShownLoader = useRef(false);

    const checkSessionStatus = useCallback(async () => {
        const token = localStorage.getItem("token");
        const currentLoginData = loginDataRef.current;

        if (!token) {
            if (currentLoginData.user_id !== '') {
                setLoginData({ user_email: '', user_id: '', user_name: '', business_data: null });
            }
            if (location.pathname !== "/authentication") {
                navigate("/authentication");
            }
            return null;
        }

        try {
            if (!alreadyShownLoader.current && currentLoginData.user_id === '') {
                setValidatingSession(true);
                alreadyShownLoader.current = true;
            }

            const url = new URL(logic_apis.authentication + "/validate-session");
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if ([401, 403].includes(response.status)) {
                notificateUserWithoutSession();
                localStorage.removeItem("token");
                setLoginData({ user_email: '', user_id: '', user_name: '', business_data: null });
                if (location.pathname !== "/authentication") {
                    navigate("/authentication");
                }
                return null;
            }

            const responseJson = await response.json();
            
            if (currentLoginData.user_id === '' ||
                currentLoginData.user_id === null ||
                currentLoginData.user_id === undefined ||
                currentLoginData.user_id !== responseJson.manager_id ||
                currentLoginData.user_email !== responseJson.manager_email ||
                currentLoginData.user_name !== responseJson.manager_name) {

                if (responseJson && responseJson.manager_id) {
                    setLoginData({
                        user_email: responseJson.manager_email,
                        user_id: responseJson.manager_id,
                        user_name: responseJson.manager_name,
                        business_data: responseJson.business_data ? JSON.parse(responseJson.business_data) : null
                    });
                } else {
                    notificateUserWithoutSession();
                    if (currentLoginData.user_id !== '') {
                        localStorage.removeItem("token");
                        setLoginData({ user_email: '', user_id: '', user_name: '', business_data: null });
                    }
                    if (location.pathname !== "/authentication") {
                        navigate("/authentication");
                    }
                    return null;
                }
            }

            return responseJson as LoginData;

        } catch (error) {
            if (error instanceof TypeError) return;
            console.error("Error en checkSessionStatus:", error);
            notificateUserWithoutSession();
            if (currentLoginData.user_id !== '') {
                localStorage.removeItem("token");
                setLoginData({ user_email: '', user_id: '', user_name: '', business_data: null });
            }
            if (location.pathname !== "/authentication") {
                navigate("/authentication");
            }
            return null;
        } finally {
            setValidatingSession(false);
        }
    }, [location, navigate, notificateUserWithoutSession, setValidatingSession, setLoginData]);

    const logoutUser = useCallback(async()=>{
        const url = new URL(logic_apis.authentication + "/logout-user");
        await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
            }
        })

        localStorage.removeItem("token");
        setLoginData({ user_email: '', user_id: '', user_name: '', business_data: null });
        window.location.reload();
    },[])

    useEffect(() => {
        if (!alreadyFetched.current) {
            alreadyFetched.current = true;
            checkSessionStatus();
        }
    }, [checkSessionStatus]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (loginData.user_id !== '' && loginData.user_id !== null && loginData.user_id !== undefined) {
            timer = setInterval(() => {
                checkSessionStatus();
            }, 10 * 1000);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [loginData.user_id, checkSessionStatus]);

    const alreadyFetched = useRef(false);

    useEffect(()=>{
        if(!validatingSession && !["", null, undefined].includes(loginData.user_id) && location.pathname === "/authentication") {
            navigate("/");
        }
    },[loginData, location])


    return useMemo(() => ({
        loginData,
        loginUser,
        setLoginData,
        registerUser,
        validatingSession,
        logoutUser
    }), [
        loginData,
        loginUser,
        setLoginData,
        registerUser,
        validatingSession,
        logoutUser
    ]);
}

export default useAuthentication;
