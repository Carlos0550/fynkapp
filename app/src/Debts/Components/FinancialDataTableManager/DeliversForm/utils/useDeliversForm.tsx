import { useEffect, useMemo, useState } from "react";
import { DeliverDataInterface } from "../../../../../Context/Typescript/DeliversTypes";
import dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";
import { useAppContext } from "../../../../../Context/AppContext";
import { ClientsInterface } from "../../../../../Context/Typescript/ClientsTypes";

function useDeliversForm(
    closeModal: () => void, 
    isEditing: boolean, 
    clientData: ClientsInterface
) {
    const {
        deliversHook:{
            createDeliver
        },
        debtsHook:{
            financialClientData:{
                totalDebtAmount
            },
            getFinancialClientData,
        }
    } = useAppContext()
    
    const [formValues, setFormValues] = useState<DeliverDataInterface>({
        deliver_id: "",
        deliver_client_id: clientData && clientData.client_id || "",
        deliver_amount: "",
        deliver_date: dayjs().toDate()
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: name === "deliver_amount" ? Number(value) || "" : value,
        }));
    };

    const validateDate = (date: Date): string => {
        const today = dayjs().startOf("day");
        const selectedDate = dayjs(date).startOf("day");

        if (!selectedDate.isValid()) return "La fecha no es válida.";
        if (selectedDate.isAfter(today)) return "La fecha no puede ser futura.";
        if (selectedDate.isBefore(today.subtract(45, "day"))) return "La fecha no puede ser anterior a 45 días.";

        return "";
    };

    const handleDateChange = (date: Date | null) => {
        const newDate = date || formValues.deliver_date;
        const error = validateDate(newDate);
        if(error) return showNotification({
            title: "Hay errores en el formulario",
            message: error,
            color: "red",
            position: "top-right",
            autoClose: 3500
        })
        setFormValues((prev) => ({ ...prev, deliver_date: dayjs(newDate).toDate() }));
    };

    const validateForm = () => {
        const dateError = validateDate(formValues.deliver_date);

        if (!formValues.deliver_amount) {
            showNotification({
                title: "Hay errores en el formulario",
                message: "El monto de la entrega es requerido.",
                color: "red",
                position: "top-right",
                autoClose: 3500
            });
            return false
        }



        if (!dayjs(formValues.deliver_date).isValid()) {
            showNotification({
                title: "Hay errores en el formulario",
                message: "La fecha de entrega es no es válida.",
                color: "red",
                position: "top-right",
                autoClose: 3500
            })

            return false
        }

        if(totalDebtAmount && totalDebtAmount < parseFloat(formValues.deliver_amount)) {
            showNotification({
                title: "Hay errores en el formulario",
                message: "El monto de la entrega no puede ser mayor al total de la deuda.",
                color: "red",
                position: "top-right",
                autoClose: 3500
            })
            return false
        }
        
        if (dateError) {
            showNotification({
                title: "Hay errores en el formulario",
                message: dateError,
                color: "red",
                position: "top-right",
                autoClose: 3500
            })
            return false
        }

        return true
    }

    const [saving, setSaving] = useState(false)
    const onFinish = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setSaving(true)
            const result = await createDeliver(formValues)
            setSaving(false)
            if (result) {
                getFinancialClientData()
                setFormValues({
                    deliver_id: "",
                    deliver_client_id: "",
                    deliver_amount: "",
                    deliver_date: dayjs().toDate()
                })
                closeModal()
            }
            
        }
    }


    return {
        formValues,
        handleInputChange,
        handleDateChange,
        onFinish
    };
}

export default useDeliversForm;
