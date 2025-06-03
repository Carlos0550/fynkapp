import { useCallback, useMemo, useState } from 'react'
import { Business, BusinessForm, EditBusinessData, NotifOptions } from './Typescript/BusinessTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

interface Props{
}
function useBusiness({}: Props) {
  const [businesData, setBusinesData] = useState<Business | null>(null)
  const [notiOption, setNotiOption] = useState<NotifOptions>('both')

  const getBusinesInfo = useCallback(async(): Promise<boolean> =>{
    const url = new URL(logic_apis.business + "/get-business")
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        }
      })
      
      if([404, 401].includes(response.status)) {
        setBusinesData(null)
        return false
      }

      const responseData = await response.json()
      if(!response.ok) throw new Error(responseData.msg || "Error desconocido")
      setBusinesData(responseData)
      setNotiOption(responseData.notif_option)
      return true
    } catch (error) {
      console.log(error)
      showNotification({
        color: "red",
        styles: (theme) => ({
          title:{color: "black"},
          description: {color: "black"}
        }),
        title: "No pudimos obtener la información de su negocio",
        message: error.message || "Error desconocido",
        autoClose: 3500,
        position: "top-right"
      })
      return false
    }
  },[])
  
  const createBusiness = useCallback(async (formData: BusinessForm): Promise<boolean | undefined> => {
    const token = localStorage.getItem("token")
    const url = new URL(logic_apis.business + "/create-business")
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()
      if ([404, 401].includes(response.status)) return false
      if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
      showNotification({
        color: "green",
        styles: (theme) => ({
          title: { color: "black" },
          description: { color: "black" }
        }),
        title: "Negocio creado con éxito",
        message: "",
        autoClose: 3500,
        position: "top-right"
      })
      setBusinesData(responseData.newBusinness)
      return true
    } catch (error) {
      console.log(error)
      if (error instanceof SyntaxError) return false
      if (error instanceof TypeError) return false
      showNotification({
        color: "red",
        styles: (theme) => ({
          title: { color: "black" },
          description: { color: "black" }
        }),
        title: "No fue posible crear el negocio",
        message: error.message,
        autoClose: 3500,
        position: "top-right"
      })
      return
    }
  }, [setBusinesData])

  const editBusiness = useCallback(async (
    formData: BusinessForm, 
    onClose: () => void,
    editBusinessInfo: EditBusinessData
  ): Promise<boolean | undefined> => {
    console.log(formData)
    const token = localStorage.getItem("token")
    const url = new URL(logic_apis.business + "/edit-business")
    url.searchParams.append("business_id", editBusinessInfo.business_id!)
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()
      if ([404, 401].includes(response.status)) return false
      if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
      showNotification({
        color: "green",
        styles: (theme) => ({
          title: { color: "black" },
          description: { color: "black" }
        }),
        title: responseData.msg,
        message: "",
        autoClose: 3500,
        position: "top-right"
      })
      setBusinesData((prev) => ({
        ...prev,
        ...formData
      }))
      onClose()
      return true
    } catch (error) {
      console.log(error)
      if (error instanceof SyntaxError) return false
      if (error instanceof TypeError) return false
      showNotification({
        color: "red",
        styles: (theme) => ({
          title: { color: "black" },
          description: { color: "black" }
        }),
        title: "No fue posible editar el negocio",
        message: error.message,
        autoClose: 3500,
        position: "top-right"
      })
      return
    }
  }, [setBusinesData])


  const changeNotificationOption = useCallback(async(option: NotifOptions, business_id: string): Promise<boolean> => {
    const url = new URL(logic_apis.business + "/change-notification-option")
    url.searchParams.append("option", option)
    url.searchParams.append("business_id", business_id)
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        method: "PUT"
      })

      const responseData = await response.json()
      if ([404, 401].includes(response.status)) return false
      if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
        showNotification({
        color: "green",
        title: "Configuración actualizada",
        message: "",
        autoClose: 1500,
        position: "top-right"
      })
      return true
    } catch (error) {
      console.log(error)
      if(error instanceof SyntaxError) return false
      if(error instanceof TypeError) return false
      showNotification({
        color: "red",
        styles: (theme) => ({
          title: { color: "black" },
          description: { color: "black" }
        }),
        title: "No fue posible editar el negocio",
        message: error.message,
        autoClose: 3500,
        position: "top-right"
      });

      return false
    }
  },[])

  return useMemo(() => ({
    createBusiness, editBusiness, notiOption, setNotiOption, changeNotificationOption,
    getBusinesInfo, setBusinesData, businesData
  }), [
    createBusiness, editBusiness, notiOption, setNotiOption, changeNotificationOption,
    getBusinesInfo, setBusinesData, businesData
  ])
}

export default useBusiness
