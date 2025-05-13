import React, { useCallback, useMemo } from 'react'
import { EmployeeFormData } from './Typescript/EmployeesTypes'
import { logic_apis } from '../apis'
import { showNotification } from '@mantine/notifications'

function useEmployeers(loginData: any) {
    
    const saveEmployee = useCallback(async(employeeData: EmployeeFormData) => {
        const url = new URL(logic_apis.employee + "/create-employee")
        const dataToSend = {
            ...employeeData,
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
            if(!response.ok){
                throw new Error(responseData.msg || "Error desconocido")
            }
    
            showNotification({
                title: "Empleado creado",
                message: "",
                color: "green",
                autoClose: 2000,
                position: "top-right"
            })
    
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error creando empleado",
                message: error.message,
                color: "red",
                autoClose: 2000,
                position: "top-right"
            })
    
            return false
        }
    },[loginData])

    return useMemo(()=> ({
        saveEmployee
    }),[
        saveEmployee
    ])
}

export default useEmployeers
