import React, { useCallback, useMemo } from 'react'
import { logic_apis } from '../apis'


import { showNotification } from '@mantine/notifications'
function useBusiness(loginData : any) {
    const createBusiness = useCallback(async (business_name: string) => {
        const url = new URL(logic_apis.business + "/create-business")
        const dataToSend = {
            business_name,
            adminID: loginData?.user_id || ""
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            })

            const responseData = await response.json()
            if (!response.ok) {
                throw new Error(responseData.msg || "Error desconocido")
            }

            showNotification({
                title: "Negocio creado",
                message: "",
                color: "green",
                autoClose: 2000,
                position: "top-right"
            })

            return responseData
        } catch (error) {
            showNotification({
                title: "Error",
                message: error instanceof Error ? error.message : "Error desconocido",
                color: "red",
                autoClose: 3000,
                position: "top-right"
            })
        }

    },[loginData])


    return useMemo(() => ({
        createBusiness
    }), [
        createBusiness
    ])
}

export default useBusiness
