import { useCallback, useMemo, useState } from 'react'
import { showNotification } from '@mantine/notifications'
import { useLocation, useNavigate } from 'react-router-dom'
import { logic_apis } from '../apis'
import { LoginDataInterface } from './Typescript/UsersTypes'
function useAuth() {
    const navigate = useNavigate()
    const location = useLocation().pathname;
    const [loginData, setLoginData] = useState<LoginDataInterface | null>(null)

    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem("token")
        console.warn("Verificando token")
        if(!token){
            showNotification({
                title: "Sesión invalida o expirada",
                message: "Inicia sesión nuevamente",
                color: "red",
                autoClose: 2000,
                position: "top-right"
            })
            return navigate("/auth-user")
        }

        try {
            const newUrl = new URL(logic_apis.users + "/verify-token")
            const response = await fetch(newUrl,{
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if(!response.ok){
                throw new Error(data.msg || "Error desconocido")
            }
            const { user } = data

            setLoginData(user)
            showNotification({
                title: `Hola, ${user.user_name}`,
                message: "",
                color: "green",
                autoClose: 1800,
                position: "top-right"
            })

            return location === "/auth-user" ? navigate("/") : null;
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Sesión invalida o expirada",
                message: "Inicia sesión nuevamente",
                color: "red",
                autoClose: 2000,
                position: "top-right"
            })
            return navigate("/auth-user")
        }
    },[])

    
    return useMemo(() => ({
        loginData,
        verifyToken
    }),[
        loginData,
        verifyToken
    ])
}

export default useAuth