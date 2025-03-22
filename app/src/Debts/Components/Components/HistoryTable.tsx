import { showNotification } from '@mantine/notifications';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { logic_apis } from '../../../apis';
import { Skeleton } from '@mantine/core';

import { FaArrowLeft } from "react-icons/fa";
import "./css/HistoryTable.css"
import dayjs from 'dayjs';
import { ClientDebt } from '../../../Context/Typescript/FinancialClientData';
import { DeliverDataInterface } from '../../../Context/Typescript/DeliversTypes';
interface ClientHistory {
    id: string
    created_at: Date;
}

interface HistoryRegistriesInterface {
    client_fullname: string;
    history: ClientHistory[];
}

interface HistoryDetailsInterface{
    created_at: Date;
    debt_date:Date;
    debt_details: ClientDebt[];
    deliver_details: DeliverDataInterface[];
    total_debts: number;
    total_delivers: number
}


function HistoryTable() {
    const [searchParams] = useSearchParams();
    const clientID = searchParams.get('clientID');
    const [fetchingData, setFetchingData] = useState(false)
    const [showHistoryDetails, setShowHistoryDetails] = useState(false)
    const [selectedHistoryId, setSelectedHistoryId] = useState("")
    const [historyRegistry, setHistoryRegistry] = useState<HistoryRegistriesInterface[]>([])
    const [clientHistoryDetails, setClientHistoryDetails] = useState<HistoryDetailsInterface[]>([])

    const getHistoryClientDetails = useCallback(async () => {
        if (!clientID) return showNotification({ title: "Error", message: "El ID del cliente no es válido", color: "red", position: "top-right", autoClose: false });
        const token = localStorage.getItem("token");
        if (!token) return showNotification({ title: "Error", message: "No se pudo obtener el historial del cliente", color: "red", position: "top-right", autoClose: false });

        console.log("BUscando")
        setFetchingData(true)
        try {
            const url = new URL(logic_apis.debts + "/get-history-client")
            url.searchParams.append("clientID", clientID)
            url.searchParams.append("history_id", selectedHistoryId)
            const result = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await result.json()
            setClientHistoryDetails(data.history)
        } catch (error) {
            showNotification({ title: "Error", message: "No se pudo obtener el historial del cliente", color: "red", position: "top-right", autoClose: false })
        } finally {
            setTimeout(() => {
                setFetchingData(false)
            }, 1000);
        }

    }, [clientID, selectedHistoryId])

    const getHistoryRegistries = useCallback(async () => {
        const url = new URL(logic_apis.debts + "/get-history-registry")
        url.searchParams.append("clientID", clientID || "")
        const token = localStorage.getItem("token");
        if (!token) return showNotification({ title: "Error", message: "No se pudo obtener el historial del cliente", color: "red", position: "top-right", autoClose: false });
        setFetchingData(true)
        try {
            const result = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const { history } = await result.json()
            setHistoryRegistry(history)
        } catch (error) {
            showNotification({ title: "Error", message: "No se pudo obtener el historial del cliente", color: "red", position: "top-right", autoClose: false })
        } finally {
            setFetchingData(false)
        }
    }, [])

    useEffect(() => {
        console.log(selectedHistoryId)
        if (selectedHistoryId && showHistoryDetails) {
            console.log("Hay id")
            getHistoryClientDetails()
        }
    }, [selectedHistoryId, showHistoryDetails])

    const alreadyFetched = useRef(false)
    useEffect(() => {
        if (clientID && !alreadyFetched.current) {
            getHistoryRegistries()
            alreadyFetched.current = true
        }
    }, [getHistoryRegistries, clientID])

    const handleReturnDays = (date: string | Date) => {
        const today = dayjs().startOf("day")
        const givenDate = dayjs(date).startOf("day")
        const diff = today.diff(givenDate, "day")
        return diff === 0 ? "hoy" : diff === 1 ? "Ayer" : `hace ${diff} días`;
    }

    const [selectedDate, setSelectedDate] = useState<string>("")
    const handleShowHistoryTable = (history_id: string, date: Date) => {
        setSelectedHistoryId(history_id)
        setSelectedDate(dayjs(date).format("DD/MM/YYYY"))
        setShowHistoryDetails(true)
    }

    const resetVariables = () => {
        setSelectedHistoryId("")
        setShowHistoryDetails(false)
        getHistoryRegistries()
        setSelectedDate("")
    }
    console.log(clientHistoryDetails)
    return (
        <React.Fragment>
            <div className='history-client-container'>
                {fetchingData
                    ? <Skeleton height={20} width={350} radius={8} variant="text" />
                    : historyRegistry && <h3>Historial de {historyRegistry[0]?.client_fullname}</h3>
                }
                <div className='history-registry-container'>
                    {
                        !showHistoryDetails && (
                            fetchingData ? (
                                <>

                                </>
                            ) : (
                                historyRegistry ? (
                                    historyRegistry.map((registry, index) => (
                                        <div className='history-registry' key={index}>
                                            <ul>
                                                {registry.history.map((history) => (
                                                    <li key={history.id} onClick={() => handleShowHistoryTable(history.id)}>
                                                        {dayjs(history.created_at).format('DD/MM/YYYY')} ({handleReturnDays(history.created_at)})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <div className='empty-history-container'>
                                        <h4>El cliente aún no tiene historial de compras/entregas</h4>
                                    </div>
                                )
                            )
                        )
                    }

                    {showHistoryDetails && (
                        fetchingData ? (
                            <>
                                <Skeleton height={30} width={500} radius={8} variant="text" />
                                <Skeleton height={30} width={500} radius={8} variant="text" />
                                <Skeleton height={30} width={500} radius={8} variant="text" />
                            </>
                        ) : (
                            <div className='history-details-container'>
                                <p onClick={() => resetVariables()} className='history-deatils-back'><FaArrowLeft /> Atras</p>

                                <h4>Registros del día {selectedDate}</h4>
                                <table className='custom-table'>
                                    <thead>
                                        <tr>
                                            <th>Fecha de deuda</th>
                                            <th>Detalle deudas</th>
                                            <th>Detalle entregas</th>
                                            <th>Total deudas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientHistoryDetails && clientHistoryDetails.map((details, index) => (
                                            <tr key={index}>
                                                <td>{dayjs(details.debt_date).format("DD/MM/YYYY")}</td>
                                                <td>{details.debt_details.map((debt, index)=> (
                                                    <ul key={index}>
                                                        <li>{debt.product_quantity} {debt.product_name} {parseFloat(debt.product_price).toLocaleString("es-AR",{style:"currency", currency: "ARS"})}</li>
                                                    </ul>
                                                ))}</td>

                                                <td>{details.deliver_details.map((deliver,index) => (
                                                    <ul key={index}>
                                                        <li>{deliver.deliver_date} | {parseFloat(deliver.deliver_amount).toLocaleString("es-AR",{style:"currency", currency: "ARS"})}</li>
                                                    </ul>
                                                ))}</td>

                                                <td>{details.total_debts.toLocaleString("es-AR",{style:"currency", currency: "ARS"})}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default HistoryTable