import React, { useCallback, useMemo, useState } from 'react'
import { DeliverDataInterface, EditDeliverHookInterface } from './Typescript/DeliversTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

function useDelivers(
  setCuentaRegresivaIniciada,
  showSessionExpiredNotification,
  getFinancialClientData
) {
    const [token] = useState(localStorage.getItem("token") || "")
    const [editDeliverHook, setEditDeliverHook] = useState<EditDeliverHookInterface>({
        deliverID: "",
        isEditing: false,
        deliverData: {
            deliver_id: "",
            deliver_amount: "",
            deliver_date: new Date(),
            deliver_client_id: ""
        }
    })

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

    const deleteDeliver = useCallback(async(deliverID: number) => {
        const url = new URL(logic_apis.clients + "/delivers/delete-deliver")
        url.searchParams.append("deliver_id", deliverID.toString())
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ deliverID })
          });

          if(response.status === 401){
            setCuentaRegresivaIniciada(true)
            showSessionExpiredNotification()
            return false
          }
          const responseData = await response.json()
          if(!response.ok) throw new Error(responseData.msg || "Error desconocido")
          showNotification({
            title: "Entrega eliminada",
            message: "La entrega se ha eliminado exitosamente",
            color: "green",
            autoClose: 3000,
            position: "top-right"
          })
          await getFinancialClientData()
          return true
        } catch (error) {
          console.log(error)
          showNotification({
            title: "Error al eliminar la entrega",
            message: error.message,
            color: "red",
            autoClose: 3000,
            position: "top-right"
          })
          return false
        }
    },[getFinancialClientData])

    const editDeliver = useCallback(async(deliverData: DeliverDataInterface) => {
        const url = new URL(logic_apis.clients + "/delivers/edit-deliver")
        try {
          const response = await fetch(url, {
            method: "PUT",
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
            title: "Entrega editada",
            message: "La entrega se ha editado exitosamente",
            color: "green",
            autoClose: 3000,
            position: "top-right"
          })
          return true
        } catch (error) {
          console.log(error)
          showNotification({
            title: "Error al editar la entrega",
            message: error.message,
            color: "red",
            autoClose: 3000,
            position: "top-right"
          })
          return false
        }
    },[])
  return useMemo(()=> ({
    createDeliver, editDeliver, deleteDeliver, editDeliverHook, setEditDeliverHook
  }),[
    createDeliver, editDeliver, deleteDeliver, editDeliverHook, setEditDeliverHook
  ])
}

export default useDelivers