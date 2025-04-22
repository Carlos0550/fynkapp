import React, { useCallback, useMemo, useState } from 'react'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'
import { UserLoginFormValuesInterface } from './Typescript/UsersTypes'
import { useNavigate } from 'react-router-dom'

function useUsers() {
  const [formSelection, setFormSelection] = useState(0)
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token")
    showNotification({
      title: "Sesión cerrada",
      message: "",
      color: "green",
      autoClose: 2000,
      position: "top-right"
    })

    return navigate("/auth-user")
  }

  const registerUser = useCallback(async (formData: any) => {
    const newUrl = new URL(logic_apis.users + "/register-user")
    try {
      const response = await fetch(newUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.msg || "Error desconocido")
      }
      showNotification({
        title: "Usuario Registrado exitosamente.",
        message: "Iniciarás sesión con los datos que proporcionaste.",
        color: "green",
        autoClose: 3000,
        position: "top-right"
      })
      setFormSelection(0)
      return true
    } catch (error) {
      console.log(error)
      showNotification({
        title: "Error al registrar el usuario",
        message: error.message,
        color: "red",
        autoClose: 3000,
        position: "top-right"
      })
      return false
    }
  }, [])

  const loginUser = useCallback(async (formValues: UserLoginFormValuesInterface) => {
    const newUrl = new URL(logic_apis.users + "/login-user")
    try {
      const response = await fetch(newUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
      })
      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.msg || "Error desconocido")
      }
      localStorage.setItem("token", responseData.token)
      showNotification({
        title: "Iniciando sesión",
        message: "Serás redirigido en unos segundos...",
        color: "green",
        autoClose: 1800,
        position: "top-right"
      })
      setTimeout(() => {
        return window.location.reload()
      }, 1000);
    } catch (error) {
      console.log(error)
      showNotification({
        title: "Error de autenticación",
        message: error.message,
        color: "red",
        autoClose: 3000,
        position: "top-right"
      })
      return false
    }
  }, [])
  return useMemo(() => ({
    registerUser,
    formSelection,
    setFormSelection,
    loginUser,
    handleLogout
  }), [
    registerUser,
    formSelection,
    setFormSelection,
    loginUser,
    handleLogout
  ])
}

export default useUsers