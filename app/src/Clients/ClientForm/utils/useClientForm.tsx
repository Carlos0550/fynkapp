import React, { useEffect, useRef, useState } from "react";
import { ClientInterfaceErrors, ClientsInterface } from "../../../Context/Typescript/ClientsTypes";
import { useAppContext } from "../../../Context/AppContext"
import { hideNotification, showNotification } from "@mantine/notifications";
function useClientForm(closeModal) {
    const clientFormRef = useRef<HTMLFormElement | null>(null);
    
    const { 
        createClient
    } = useAppContext()

    const [formValues, setFormValues] = useState<ClientsInterface>({
        client_id: "",
        client_dni: 0,
        client_fullname: "",
        client_email: "",
        client_address: "",
        client_city: "",
        client_phone: 0,
    });

    const [errors, setErrors] = useState<ClientInterfaceErrors>({
        client_dni: "",
        client_fullname: "",
        client_email: "",
        client_address: "",
        client_city: "",
        client_phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const validateFields = () => {
        setErrors({
            client_dni: "",
            client_fullname: "",
            client_email: "",
            client_address: "",
            client_city: "",
            client_phone: "",
        })

        let newErrors: Partial<ClientInterfaceErrors> = {};
    
        for (const field in formValues) {
            if(formValues.client_id === "") continue
            if (!formValues[field as keyof ClientsInterface]) {
                newErrors[field as keyof ClientInterfaceErrors] = "Campo requerido";
            }
        }
    
        const regexDNI = /^\d{8}$/;
        if (!regexDNI.test(formValues.client_dni.toString())) {
            newErrors.client_dni = "DNI inválido";
        }
    
        const regexPhone = /^\d{7,10}$/;
        if (!regexPhone.test(formValues.client_phone.toString())) {
            newErrors.client_phone = "Teléfono inválido";
        }
    
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };

    
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
            const result = await createClient(formValues)
            hideNotification(notificationID)
            if(result){
                setFormValues({
                    client_id: "",
                    client_dni: 0,
                    client_fullname: "",
                    client_email: "",
                    client_address: "",
                    client_city: "",
                    client_phone: 0
                })

                setErrors({
                    client_dni: "",
                    client_fullname: "",
                    client_email: "",
                    client_address: "",
                    client_city: "",
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

    useEffect(() => {
        const interval = setInterval(() => {
            if (clientFormRef.current) {    
                const inputs = Array.from(clientFormRef.current.querySelectorAll<HTMLInputElement>("input"));
                inputs.forEach((input) => input.addEventListener("input", handleInputChange));
    
                clearInterval(interval);
            }
        }, 500); 
    
        return () => clearInterval(interval); 
    }, []);
    

    return {
        clientFormRef,
        formValues,
        setFormValues,
        errors,
        setErrors,
        validateFields,
        onFinish,
    };
}

export default useClientForm;
