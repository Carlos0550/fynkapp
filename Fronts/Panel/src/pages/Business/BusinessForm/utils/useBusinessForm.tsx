import React, { useEffect, useState } from 'react'
import { BusinessForm, EditBusinessData } from '../../../../Context/Typescript/BusinessTypes'
import { showNotification } from '@mantine/notifications'
import { useAppContext } from '../../../../Context/AppContext'

interface Props{
    onClose: () => void
}
function useBusinessForm({
    onClose
}:Props) {
    const {
        businessHook:{
            createBusiness,
            editBusiness
        },
        modalsHook:{
            closeBusinessModal,
            editingBusinessData
        }
    } = useAppContext()
    const [formData, setFormData] = useState<BusinessForm>({
        business_name: "",
        business_address: "",
        business_phone: ""
    })

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const [creating, setCreating] = useState(false)
    const onFailure = () => {
        return showNotification({
            color: "red",
            styles: (theme) => ({
                title: { color: "black" },
                description: { color: "black" }
            }),
            title: "No fué posible guardar este negocio.",
            message: "Intenta recargar esta sección.",
            autoClose: 3500,
            position: "top-right"
        })
    }
    const onFinish = async() => {
        setCreating(true)
        const result = editingBusinessData.isEditing
        ? await editBusiness(formData, onClose, editingBusinessData)
        : await createBusiness(formData)
        setCreating(false)
        if(typeof result === 'boolean' && !result) onFailure()
        if(typeof result === 'boolean' && result) closeBusinessModal()
    }

    useEffect(() => {
        if(editingBusinessData.business_id){
            setFormData({
                business_address: editingBusinessData.business_address || "",
                business_name: editingBusinessData.business_name || "",
                business_phone: editingBusinessData.business_phone || ""
            });
        };
    },[editingBusinessData]);
  return {
    inputChange,
    formData,
    onFinish,
    creating
  }
}

export default useBusinessForm
