import React, { useCallback, useMemo, useState } from 'react'
import { LoginData, LoginUserForm } from '../Context/Typescript/AuthenticationTypes'
import { showNotification } from '@mantine/notifications'
import { logic_apis } from '../apis'
import { useNavigate } from 'react-router-dom'
function useAuthentication() {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState<LoginData>({
        user_email: '',
        user_id: '',
        user_name: ''
    })

    const loginUser = useCallback(async (formValues: LoginUserForm) => {
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
            })

            if (!response.ok) throw new Error(response.statusText)
            if (response.status === 404) throw new Error("El usuario no existe")
            if (response.status === 401) throw new Error("Contraseña incorrecta")
            const responseJson = await response.json()
            showNotification({
                color: "green",
                title: `Bienvenido, ${responseJson.user_name}`,
                message: "",
                autoClose: 2500,
                position: "top-right"
            })
            setLoginData(responseJson)
            navigate("/")
            return;
        } catch (error) {
            console.log(error)
            showNotification({
                color: "red",
                title: "Error al iniciar sesión",
                message: error instanceof Error ? error.message : "Error desconocido",
                autoClose: 4500,
                position: "top-right"
            })

            return;
        }
    }, [])
    return useMemo(() => ({
        loginData, loginUser
    }), [
        loginData, loginUser
    ])
}

export default useAuthentication
