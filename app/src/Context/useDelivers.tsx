import React, { SetStateAction, useCallback, useMemo } from 'react'
import { DeliverForm } from './Typescript/DeliversTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

interface Props {
    client_id: string,
    getAllClients: () => Promise<boolean>
}
function useDelivers({
    client_id,
    getAllClients
}: Props) {
    const saveDeliver = useCallback(async (deliverData: DeliverForm): Promise<boolean> => {
        const url = new URL(logic_apis.delivers + "/save-deliver")
        url.searchParams.append("client_id", client_id)

        try {
            const result = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify(deliverData)
            })

            const responseData = await result.json()
            if ([404, 401].includes(result.status)) return false
            if (result.status === 417) {
                showNotification({
                    color: "red",
                    styles: (theme) => ({
                        title: { color: "black" },
                        description: { color: "black" }
                    }),
                    title: responseData.msg,
                    message: `Introduzca un monto no mayor a ${parseFloat(responseData.totalDebtsClient).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}`,
                    autoClose: 5000,
                    position: "top-right"
                })

                return false;
            }
            if (!result.ok) throw new Error(responseData.msg || "Error desconocido")
                await getAllClients()
            return true
        } catch (error) {
            console.log(error)
            if (error instanceof SyntaxError) return false
            if (error instanceof TypeError) {
                showNotification({
                    color: "red",
                    styles: (theme) => ({
                        title: { color: "black" },
                        description: { color: "black" }
                    }),
                    title: "Error de conexión",
                    message: "Verifique su conexión a internet",
                    autoClose: 3500,
                    position: "top-right"
                })
            }
            showNotification({
                color: "red",
                styles: (theme) => ({
                    title: { color: "black" },
                    description: { color: "black" }
                }),
                title: "Error al guardar la entrega",
                message: error.message,
                autoClose: 3500,
                position: "top-right"
            })
            return false
        }
    }, [client_id, getAllClients])
    return useMemo(() => ({
        saveDeliver
    }), [
        saveDeliver
    ])
}

export default useDelivers
