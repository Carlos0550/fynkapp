import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { logic_apis } from "../apis"
import { AccountSummary, SummaryCards } from './Typescript/ResumeTypes'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { IoAnalytics } from 'react-icons/io5'
import { CiCircleAlert } from 'react-icons/ci'
function useResume() {
    const [resumes, setResumes] = useState<AccountSummary>({
        summary_id: "",
        manager_id: "",
        created_at: "",
        monthName: "",
        total_debt: 0,
        total_deliver: 0,
        best_customers: [],
        worst_customers: [],
        recovery_rate: 0,
        payment_behavior: {
            "0-15": [],
            "16-30": [],
            "31-60": [],
            "60+": []
        }
    })

    const [monthsAvailable, setMonthsAvailable] = useState<string[]>([])

    const [summaryCards, setSummaryCards] = useState<SummaryCards[]>([])

    const getMonthlyResume = useCallback(async (): Promise<boolean> => {
        const token = localStorage.getItem("token")
        const url = new URL(logic_apis.resume + "/get-monthly-resume")
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.msg || "Error desconocido")
            setResumes(responseData.data)
            setMonthsAvailable(responseData.monthsAvailable)
            setSummaryCards([
                {
                    summary_name: "Total de Deudas",
                    summary_value: responseData.data && parseFloat(responseData.data.total_debt.toString()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
                    summary_icon: <CiCircleAlert color="red" size={25} />,
                    summary_color: "#ffe5e5",
                    summary_leyend_color: "red"
                },
                {
                    summary_name: "Pagos Recibidos",
                    summary_value: responseData.data && parseFloat(responseData.data.total_deliver.toString()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
                    summary_icon: <MdOutlineAttachMoney color="green" size={25} />,
                    summary_color: "#e2fbe2",
                    summary_leyend_color: "green"
                },{
                    summary_name: "Tasa de Recuperación",
                    summary_value: responseData.data && `${responseData.data.recovery_rate}%`,
                    summary_icon: <IoAnalytics color="#9500FF" size={25} />,
                    summary_color: "#f3e2ff",
                    summary_leyend_color: "#9500FF"
                }
            ])
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }, [setSummaryCards, setResumes])

   

    return useMemo(() => ({
        getMonthlyResume, resumes, summaryCards,monthsAvailable
    }), [
        getMonthlyResume, resumes, summaryCards, monthsAvailable
    ])
}

export default useResume
