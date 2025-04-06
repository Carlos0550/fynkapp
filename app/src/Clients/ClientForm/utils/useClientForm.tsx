import React, { useEffect, useRef, useState } from "react";
import { ClientInterfaceErrors, ClientsInterface } from "../../../Context/Typescript/ClientsTypes";
import { useAppContext } from "../../../Context/AppContext"
import { hideNotification, showNotification } from "@mantine/notifications";
function useClientForm(closeModal, clientData) {
    const clientFormRef = useRef<HTMLFormElement | null>(null);

    const { 
        clientsHook:{
            createClient, editClient
        }
    } = useAppContext()

    useEffect(() => {
        if(clientData && Object.keys(clientData).length > 0){
            setFormValues(clientData)
            const fields = Array.from(clientFormRef.current?.querySelectorAll<HTMLInputElement>("input") || [])
            fields[0].focus()
            fields.forEach((field) => {
                
                if(field.name === "client_phone") field.value = clientData["client_phone"].toString()
                field.value = clientData[field.name as keyof ClientsInterface]
            })
        }
    },[clientData])

    const [formValues, setFormValues] = useState<ClientsInterface>({
        client_id: "",
        client_dni: "",
        client_fullname: "",
        client_email: "",

        client_phone: "",
    });

    const [errors, setErrors] = useState<ClientInterfaceErrors>({
        client_dni: "",
        client_fullname: "",
        client_email: "",
        client_phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validateFields = () => {
        setErrors({
            client_dni: "",
            client_fullname: "",
            client_email: "",
            client_phone: "",
        });
    
        let newErrors: Partial<ClientInterfaceErrors> = {};
    
        if (!formValues.client_dni) {
            newErrors.client_dni = "Campo requerido";
        }
    
        if (!formValues.client_fullname) {
            newErrors.client_fullname = "Campo requerido";
        }
    
        if (formValues.client_dni) {
            const regexDNI = /^\d{8}$/;
            if (!regexDNI.test(formValues.client_dni.toString())) {
                newErrors.client_dni = "DNI inválido";
            }
        }
    
        if (formValues.client_phone) {
            const regexPhone = /^\d{7,10}$/;
            if (!regexPhone.test(formValues.client_phone.toString())) {
                newErrors.client_phone = "Teléfono inválido";
            }
        }
    
    
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };
    
    useEffect(()=>{
        console.log(formValues)
    },[formValues])
    const onFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        const notificationID = Date.now().toString();
        
        if(validateFields()){
            showNotification({
                id: notificationID,
                title: "Guardando...",
                message: "",
                color: "blue",
                loading: true,
                autoClose: false,
                position: "top-right",
            })
            const result = clientData 
            ? await editClient(formValues)
            : await createClient(formValues)
            hideNotification(notificationID)
            if(result){
                setFormValues({
                    client_id: "",
                    client_dni: "",
                    client_fullname: "",
                    client_email: "",
                    client_phone: ""
                })

                setErrors({
                    client_dni: "",
                    client_fullname: "",
                    client_email: "",
                    client_phone: "",
                })

                closeModal()
            }
        }else{
            showNotification({
                title: "Verifique los campos, todos son obligatorios.",
                message: "",
                color: "red",
                autoClose: 2000,
                position: "top-right",
            })
        }
    };

    return {
        clientFormRef,
        formValues,
        setFormValues,
        errors,
        setErrors,
        validateFields,
        onFinish,
        handleInputChange,
    };
}

export default useClientForm;
