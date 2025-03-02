import React, { useCallback, useMemo, useState } from 'react'
import { DeliverDataInterface } from './Typescript/DeliversTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

function useDelivers(
  setCuentaRegresivaIniciada,
  showSessionExpiredNotification,
) {
    const [token] = useState(localStorage.getItem("token") || "")

    const createDeliver = useCallback(async(deliverData: DeliverDataInterface) => {
        const url = new URL(logic_apis.clients + "/delivers/create-deliver")
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(deliverData)
          });

          if(response.status === 401){
            setCuentaRegresivaIniciada(true)
            showSessionExpiredNotification()
            return false
          }
          const responseData = await response.json()
          if(!response.ok) throw new Error(responseData.msg || "Error desconocido")
          showNotification({
            title: "Entrega creada",
            message: "La entrega se ha creado exitosamente",
            color: "green",
            autoClose: 3000,
            position: "top-right"
          })

          return true
        } catch (error) {
          console.log(error)
          showNotification({
            title: "Error al guardar la entrega",
            message: error.message,
            color: "red",
            autoClose: 3000,
            position: "top-right"
          })
          return false
        }
    },[])
  return useMemo(()=> ({
    createDeliver
  }),[
    createDeliver
  ])
}

export default useDelivers