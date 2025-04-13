import React, { useState } from 'react'
import { 
    EmployeeFormData, 
    EmployeeRole, 
    SectionsForRolesInterface
} from '../../../../Context/Typescript/EmployeesTypes'

import { validateEmployeeForm } from './ValidateEmployeeForm'

import { showNotification } from "@mantine/notifications"
import { useAppContext } from "../../../../Context/AppContext"
function useEmployeeForm() {
    const {  
        employeersHook:{
            saveEmployee
        }
    } = useAppContext()
    const [formData, setFormData] = useState<EmployeeFormData>({
        employee_name: "",
        employee_dni: "",
        employee_role: {
            level: "level1",
            access_to: []
        },
        employee_email: ""
    })

    const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(() => ({
            ...formData,
            [name]: value
        }));
    }

    const handleChangeRole = (
        selectedLevel: EmployeeRole["level"], 
        selectedAccess: (keyof SectionsForRolesInterface)[]
    ) => {
        if (selectedLevel === 'custom') {
            setFormData((prev) => ({
              ...prev,
              employee_role: {
                level: selectedLevel,
                access_to: selectedAccess
              }
            }))
          } else {
            setFormData((prev) => ({
              ...prev,
              employee_role: {
                level: selectedLevel,
                access_to: []
              }
            }))
          }
          
    }

    const [saving, setSaving] = useState(false)
    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault()
        const validation = validateEmployeeForm(formData)
        if(!validation.valid){
            console.log("errores: ", validation.errors)
            showNotification({
                title: "Hay errores en el formulario.",
                message: `\n ${validation.errors[0]}`,
                autoClose: 4500,
                color: "red",
                position: "top-left"
            })
            return
        }
        setSaving(true)
        await saveEmployee(formData)
        setSaving(false)
    }
    return {
        handleChangeRole,
        handleChangeValues,
        handleSubmit
    }
}

export default useEmployeeForm
