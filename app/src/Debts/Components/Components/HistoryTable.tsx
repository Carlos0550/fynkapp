import { showNotification } from '@mantine/notifications';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { logic_apis } from '../../../apis';
import { Skeleton } from '@mantine/core';
import { FaArrowLeft } from "react-icons/fa";
import "./css/HistoryTable.css";
import dayjs from 'dayjs';
import { ClientDebt } from '../../../Context/Typescript/FinancialClientData';
import { DeliverDataInterface } from '../../../Context/Typescript/DeliversTypes';

interface ClientHistory {
  id: string;
  created_at: Date;
}

interface HistoryRegistry {
  client_fullname: string;
  history: ClientHistory[];
}

interface HistoryDetails {
  created_at: Date;
  debt_date: Date;
  debt_details: ClientDebt[];
  deliver_details: DeliverDataInterface[];
  total_debts: number;
  total_delivers: number;
}

const HistoryTable: React.FC = () => {
  const [searchParams] = useSearchParams();
  const clientID = searchParams.get('clientID');

  const [isFetching, setIsFetching] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  const [historyRegistries, setHistoryRegistries] = useState<HistoryRegistry[]>([]);
  const [historyDetails, setHistoryDetails] = useState<HistoryDetails[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  const notifyError = (message: string) => {
    showNotification({
      title: "Error",
      message,
      color: "red",
      position: "top-right",
      autoClose: false
    });
  };

  const getToken = () => localStorage.getItem("token");

  const fetchHistoryDetails = useCallback(async () => {
    if (!clientID) {
      notifyError("El ID del cliente no es válido");
      return;
    }
    const token = getToken();
    if (!token) {
      notifyError("No se pudo obtener el historial del cliente");
      return;
    }

    setIsFetching(true);
    try {
      const url = new URL(`${logic_apis.debts}/get-history-client`);
      url.searchParams.append("clientID", clientID);
      url.searchParams.append("history_id", selectedHistoryId);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      setHistoryDetails(data.history);
    } catch (error) {
      notifyError("No se pudo obtener el historial del cliente");
    } finally {
        setIsFetching(false)
    }
  }, [clientID, selectedHistoryId]);

  const fetchHistoryRegistries = useCallback(async () => {
    const token = getToken();
    if (!token) {
      notifyError("No se pudo obtener el historial del cliente");
      return;
    }
    setIsFetching(true);
    try {
      const url = new URL(`${logic_apis.debts}/get-history-registry`);
      url.searchParams.append("clientID", clientID || "");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const { history } = await response.json();
      setHistoryRegistries(history);
    } catch (error) {
      notifyError("No se pudo obtener el historial del cliente");
    } finally {
      setIsFetching(false);
    }
  }, [clientID]);

  useEffect(() => {
    if (selectedHistoryId && showDetails) {
      fetchHistoryDetails();
    }
  }, [selectedHistoryId, showDetails, fetchHistoryDetails]);

  const alreadyFetched = useRef(false);
  useEffect(() => {
    if (clientID && !alreadyFetched.current) {
      fetchHistoryRegistries();
      alreadyFetched.current = true;
    }
  }, [clientID, fetchHistoryRegistries]);

  const getDaysDifference = (date: string | Date): string => {
    const today = dayjs().startOf("day");
    const givenDate = dayjs(date).startOf("day");
    const diff = today.diff(givenDate, "day");
    if (diff === 0) return "hoy";
    if (diff === 1) return "Ayer";
    return `hace ${diff} días`;
  };

  const handleSelectHistory = (historyId: string, date: Date) => {
    setSelectedHistoryId(historyId);
    setSelectedDate(dayjs(date).format("DD/MM/YYYY"));
    setShowDetails(true);
  };

  const handleReset = () => {
    setSelectedHistoryId("");
    setShowDetails(false);
    setSelectedDate("");
    fetchHistoryRegistries();
  };

  return (
    <div className='history-client-container'>
      {isFetching ? (
        <Skeleton height={20} width={350} radius={8} variant="text" />
      ) : (
        historyRegistries.length > 0 && (
          <h3>Historial de {historyRegistries[0].client_fullname}</h3>
        )
      )}

      <div className='history-registry-container'>
        {!showDetails ? (
          isFetching ? null : (
            historyRegistries.length > 0 ? (
              historyRegistries.map((registry, idx) => (
                <div className='history-registry' key={idx}>
                  <ul>
                    {registry.history.map((history) => (
                      <li
                        key={history.id}
                        onClick={() => handleSelectHistory(history.id, history.created_at)}
                      >
                        {dayjs(history.created_at).format('DD/MM/YYYY')} ({getDaysDifference(history.created_at)})
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
        ) : isFetching ? (
          <>
            <Skeleton height={30} width={500} radius={8} variant="text" />
            <Skeleton height={30} width={500} radius={8} variant="text" />
            <Skeleton height={30} width={500} radius={8} variant="text" />
          </>
        ) : (
          <div className='history-details-container'>
            <p onClick={handleReset} className='history-deatils-back'>
              <FaArrowLeft /> Atrás
            </p>
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
                {historyDetails.map((details, idx) => (
                  <tr key={idx}>
                    <td>{dayjs(details.debt_date).format("DD/MM/YYYY")}</td>
                    <td>
                      {details.debt_details.map((debt, i) => (
                        <ul key={i}>
                          <li>
                            {debt.product_quantity} {debt.product_name}{" "}
                            {parseFloat(debt.product_price).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS"
                            })}
                          </li>
                        </ul>
                      ))}
                    </td>
                    <td>
                      {details.deliver_details.map((deliver, i) => (
                        <ul key={i}>
                          <li>
                            {deliver.deliver_date} |{" "}
                            {parseFloat(deliver.deliver_amount).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS"
                            })}
                          </li>
                        </ul>
                      ))}
                    </td>
                    <td>
                      {details.total_debts.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTable;
