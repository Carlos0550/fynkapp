import React, { useEffect, useState } from 'react'
import { DeliverForm } from '../../../../../../../../../Context/Typescript/DeliversTypes'
import dayjs from 'dayjs'
import { showNotification } from '@mantine/notifications'
import { DateValue } from '@mantine/dates'
import { useAppContext } from '../../../../../../../../../Context/AppContext'

function useNewDeliver() {
    const [formData, setFormData] = useState<DeliverForm>({
        deliver_amount: "",
        deliver_date: "",
        deliver_details: ""
    })

    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const {
        deliversHook:{
            saveDeliver
        }
    } = useAppContext()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSaveDate = (date: DateValue) => {
        if (!date) return;

        const daysLimit = 45;
        const today = dayjs().startOf("day");
        const selectedDate = dayjs(date).startOf("day");
        if (selectedDate.isBefore(today.subtract(daysLimit, "days"))) {
            console.log("selectedDate.diff(today, 'days')", selectedDate.diff(today, "days"))
            showNotification({
                title: "Fecha no válida",
                message: `La fecha de entrega no puede ser mayor a ${daysLimit} días`,
                color: "red",
                autoClose: 5000,
                position: "top-right"
            })
            return;
        } else if (selectedDate.isAfter(today)) {
            showNotification({
                title: "Fecha no válida",
                message: "La fecha de entrega no puede ser en el futuro",
                color: "red",
                autoClose: 5000,
                position: "top-right"
            })
            return;
        }

        const currentHour = dayjs().hour();
        const currentMinute = dayjs().minute();
        const currentSecond = dayjs().second();

        const combinedDate = dayjs(date)
            .hour(currentHour)
            .minute(currentMinute)
            .second(currentSecond);

        const formattedDate = combinedDate.format("YYYY-MM-DD HH:mm:ss");

        setFormData(prev => ({
            ...prev,
            deliver_date: formattedDate
        }));
    };

    const handleFinish = async(e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const result = await saveDeliver(formData)
        setSaving(false)
        if (result) setSaved(true)
    }

    useEffect(()=>{
        setFormData({
            ...formData,
            deliver_date: dayjs().format("YYYY-MM-DD HH:mm:ss")
        })
    },[])
    return {
        formData,
        handleChange,
        handleSaveDate,
        handleFinish,
        saved, saving

    }
}

export default useNewDeliver
