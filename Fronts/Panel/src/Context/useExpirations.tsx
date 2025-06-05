import React, { useCallback, useMemo, useState } from 'react'
import { errorTypesRequest, Expirations } from './Typescript/ExpirationsTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

interface Props {
    business_id: string
}


function useExpirations({
    business_id
}: Props) {
    const [expirations, setExpirations] = useState<Expirations[]>([])

    const getExpirations = useCallback(async (): Promise<{ errorType: errorTypesRequest, error: boolean }> => {
        if (!business_id) {
            showNotification({
                color: "yellow",
                title: "La información no pudo ser cargada",
                message: "Intenta recargar esta sección",
                autoClose: 3000,
                position: "top-right"
            })
            return {
                errorType: "noBusinessId",
                error: true
            }
        }
        const url = new URL(logic_apis.expirations + "/get-expirations")
        url.searchParams.append("business_id", business_id)

        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            })
            const responseData = await response.json()
            if (response.status === 404) {
                setExpirations([])
                return {
                    errorType: "noExpirations",
                    error: true
                }
            }
            if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
            setExpirations(responseData)
            return {
                errorType: "noError",
                error: false
            }
        } catch (error) {
            console.log(error)
            showNotification({
                color: "red",
                title: "La información no pudo ser cargada",
                message: "Intenta recargar esta sección",
                autoClose: 3000,
                position: "top-right"
            })

            return {
                errorType: "serverError",
                error: true
            }
        }
    }, [business_id])
    return useMemo(() => ({
        getExpirations, expirations
    }), [
        getExpirations, expirations
    ])
}

export default useExpirations
