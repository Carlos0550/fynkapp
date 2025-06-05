import { Table, Text, Badge, Flex, Box, Button, Notification } from "@mantine/core"
import { FaCalendarTimes, FaUser, FaMoneyBillAlt, FaClock, FaRegCheckCircle } from "react-icons/fa"
import { FaUserClock } from "react-icons/fa6";
import { useAppContext } from "../../Context/AppContext"
import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import { MdCircleNotifications, MdNotificationImportant } from "react-icons/md";

function getDebtStatus(dueDate) {
  const today = dayjs().startOf("day")
  const due = dayjs(dueDate).startOf("day")
  const diffDays = today.diff(due, "day")

  if (diffDays < 0 && Math.abs(diffDays) <= 7) {
    return { status: "Por vencer", daysLate: 0, color: "yellow" }
  } else if (diffDays < 0) {
    return { status: "Sin vencer", daysLate: 0, color: "green" }
  } else if (diffDays < 7) {
    return { status: "Vencida", daysLate: diffDays, color: "yellow" }
  } else if (diffDays < 15) {
    return { status: "Vencida", daysLate: diffDays, color: "orange" }
  } else {
    return { status: "Vencida", daysLate: diffDays, color: "red" }
  }
}

function Expirations() {
  const alreradyFetched = useRef(false)
  const [showRefetch, setShowRefetch] = useState(false)
  const {
    expirationsHook: {
      expirations, getExpirations
    },
    clientsHook: {
      clients
    },
    notificationsHook: {
      sendNotification
    }
  } = useAppContext()

  const [notifStatus, setNotifStatus] = useState({});

  const handleSendNotif = async (id: string) => {
    updateNotifStatus(id, "sending")
    const result = await sendNotification(id) 
    if (result) {
      updateNotifStatus(id, "success")
    } else {
      updateNotifStatus(id, "error")
      setTimeout(() => updateNotifStatus(id, null), 1500)
    }
  }

  const updateNotifStatus = (id: string, newState: string | null) => {
    setNotifStatus(prev => ({
      ...prev,
      [id]: newState
    }))
  }


  function getClientName(client_id: string) {
    if (!client_id) return ""
    const client = clients.find(client => client.client_id === client_id)
    return client ? client.client_name : ""
  }

  const handleFetchExpirations = async () => {
    const { errorType, error } = await getExpirations()
    if (error && errorType === "noBusinessId") setShowRefetch(true)
  }

  useEffect(() => {
    if (!alreradyFetched.current) {
      handleFetchExpirations()
      alreradyFetched.current = true
    }
  }, [])

  return (
    <Flex direction="column" gap="md" p="md">
      <Flex
        direction={"column"}
        gap="md"
        align="flex-start"
        justify="flex-start"
      >
        <Flex align="center" gap="xs" justify={"center"}><FaUserClock size={18} /><Text size="xl" fw={700} ff="Roboto Slab">Vencimientos</Text></Flex>
        <Text size="sm" fw={500} ff="Roboto Slab">Visualizá con más detalle que clientes son deudores en tu negocio | Se actualizan cada 24 horas</Text>
      </Flex>

      {expirations.length === 0 ? (
        showRefetch ? (
          <Flex justify="flex-start" align="center" gap="xs">
            <Text c="dimmed">Algo no ha salido bien</Text>
            <Text style={{ cursor: "pointer" }} variant="link" onClick={handleFetchExpirations} c="blue">Intentar de nuevo</Text>
          </Flex>
        ) : (
          <Text c="dimmed">Tus clientes no tienen deudas vencidas, eso es genial.</Text>
        )
      ) : (
        <Box
          style={{ overflowX: "scroll" }}
        >
          <Table highlightOnHover withTableBorder withColumnBorders striped verticalSpacing="sm" style={{ minWidth: "800px" }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th><FaUser style={{ marginRight: 5 }} /> Cliente</Table.Th>
                <Table.Th><FaMoneyBillAlt style={{ marginRight: 5 }} /> Monto</Table.Th>
                <Table.Th><FaCalendarTimes style={{ marginRight: 5 }} /> Fecha de vencimiento</Table.Th>
                <Table.Th><FaClock style={{ marginRight: 5 }} /> Días de atraso</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {expirations.map((exp) => {
                const { status, daysLate, color } = getDebtStatus(exp.expired_date)
                const state = notifStatus[exp.expired_id] || null
                return (
                  <Table.Tr key={exp.expired_id}>
                    <Table.Td>{getClientName(exp.expired_client_id)}</Table.Td>
                    <Table.Td>{Number(exp.expired_amount).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</Table.Td>
                    <Table.Td>{new Date(exp.expired_date).toLocaleDateString()}</Table.Td>
                    <Table.Td>{status === "Vencida" ? daysLate : "-"}</Table.Td>
                    <Table.Td><Badge color={color}>{status}</Badge></Table.Td>
                    <Table.Td>
                      <Box>
                        {state === "success" ? (
                          <Notification withCloseButton={false} icon={<MdCircleNotifications size={18} />} title="Recordatorio enviado" color="green">
                            El cliente fue notificado de su deuda
                          </Notification>
                        ) : state === "error" ? (
                          <Notification withCloseButton={false} icon={<MdNotificationImportant size={18} />} title="Error al enviar el recordatorio" color="maroon" />
                        ) : (
                          <Button
                            color='dark'
                            onClick={() => handleSendNotif(exp.expired_client_id)}
                            loading={state === "sending"}
                            disabled={state === "sending"}
                            leftSection={<MdCircleNotifications size={18} />}
                          >
                            {state === "sending" ? "Enviando..." : "Enviar recordatorio"}
                          </Button>
                        )}
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Box>
      )}
    </Flex>
  )
}

export default Expirations
