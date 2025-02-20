import React, { useCallback, useMemo } from 'react'
import { logic_apis } from '../apis'
import { notification } from 'antd'

function useUsers() {
  const registerUser = useCallback(async(formData: any) => {
    const newUrl = new URL(logic_apis.users + "/register-user")
    try {
      const response = await fetch(newUrl, {
        method: "POST",
        body: formData
      })

      const responseData = await response.json()
      if(!response.ok){
        
        throw new Error(responseData.msg || "Error desconocido")
      }

      notification.success({
        message: "Usuario creado con exito",
        description: "Iniciarás sesión ahora con los datos que ingresaste",
        duration: 3,
        showProgress: true,
        pauseOnHover: false
      })

      return true
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Error al crear el usuario",
        description: error.message,
        duration: 3,
        pauseOnHover: false,
        showProgress: true
      })
      return false
    }
  },[])
  return useMemo(() => ({
    registerUser
  }),[
    registerUser
  ])
}

export default useUsers