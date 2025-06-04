import { Button, Flex, Skeleton, Text, Paper, Box, Badge, Notification } from '@mantine/core'
import { FaUserEdit, FaUserSlash } from 'react-icons/fa'
import { TbReportMoney } from 'react-icons/tb'
import { GiTakeMyMoney } from 'react-icons/gi'
import useClientFData from '../../utils/useClientFData'
import { useAppContext } from '../../../../../../../../Context/AppContext'
import FinancialTabs from './Components/FinancialTabs'
import { useEffect, useRef, useState } from 'react'
import { MdCircleNotifications } from "react-icons/md";

import { FaRegCheckCircle } from "react-icons/fa";
import { MdNotificationImportant } from "react-icons/md";
function ClientInfo({ setSections }) {
  const {
    gettingClientData,
    clientData,
    aditionalDataLength,
  } = useClientFData()

  const {
    modalsHook: { selectedClientData },
    clientsHook: { setEditingClient },
    financialClientHook: { getFinancialClientData, financialClientData: { movimientos } },
    notificationsHook: { sendNotification }

  } = useAppContext()

  const [gettingFinancialData, setGettingFinancialData] = useState(false)
  const handleGetFinancialData = async () => {
    setGettingFinancialData(true)
    await getFinancialClientData()
    setGettingFinancialData(false)
  }

  const alreadyFetched = useRef(false)
  useEffect(() => {
    if (!selectedClientData.client_id || alreadyFetched.current) return
    alreadyFetched.current = true
    handleGetFinancialData()
  }, [selectedClientData.client_id])

  const hasAtLeastOneOverdueDebt = (): boolean => {
    let count = 0

    if (movimientos.length === 0) return false
    movimientos.filter(m => m.tipo === "deuda").forEach((m) => {
      if (m.estado_financiero === "activo" && (m.estado === "Vencida" || m.estado === "Por vencer")) count++
    })
    if (count > 0) return true

    return false
  }

  const [sendingNotif, setSendingNotif] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendError, setSendError] = useState(false)
  const handleSendNotif = async () => {
    setSendingNotif(true)
    const result = await sendNotification()
    setSendingNotif(false)
    if (result) {
      setSendSuccess(true)
    } else {
      setSendError(true)
      setTimeout(() => setSendError(false), 1500)
    }
  }

  const getSendNotifBtnIcon = () => {
    if (sendSuccess) return <FaRegCheckCircle size={18} />
    if (sendError) return <MdNotificationImportant size={18} />
    return <MdCircleNotifications size={18} />
  }

  const getSendNotifBtnText = () => {
    if (sendSuccess) return "Recordatorio enviado"
    if (sendError) return "Error al enviar"
    return "Enviar recordatorio"
  }

  return (
    <Flex direction="column" gap={20}>

      <Flex justify="space-between" align="center" wrap={"wrap"}>
        <Box>
          <Text fw={700} size="xl">{selectedClientData.client_name}</Text>
          {clientData.aditional_client_data.client_dni && (
            <Text c="dimmed" size="sm">DNI: {clientData.aditional_client_data.client_dni}</Text>
          )}
        </Box>

        <Flex gap={10}>
          <Button
            size="sm"
            variant="outline"
            color="gray"
            leftSection={<FaUserEdit />}
            onClick={() => {
              setSections("editData")
              setEditingClient(true)
            }}
            disabled={gettingClientData}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            color="red"
            leftSection={<FaUserSlash />}
            onClick={() => setSections("deleteSelf")}
          >
            Eliminar
          </Button>
        </Flex>
      </Flex>

      {aditionalDataLength > 0 && (
        <Paper withBorder p={15} radius="md">
          <Text fw={600} size="md" mb={10}>Datos del cliente</Text>
          {
            gettingClientData ? (
              <Flex direction="column" gap={10}>
                <Skeleton height={12} width={100} radius="sm" />
                <Skeleton height={12} width={250} radius="sm" />
                <Skeleton height={12} width={350} radius="sm" />
                <Skeleton height={12} radius="sm" />
              </Flex>
            ) : (
              <Flex justify="space-between" wrap="wrap" rowGap={5}>
                <Flex direction="column" gap={10}>
                  {clientData.aditional_client_data.client_email && (
                    <Text size="sm">Correo electrónico<br /><strong>{clientData.aditional_client_data.client_email}</strong></Text>
                  )}
                  {clientData.aditional_client_data.client_email && (
                    <Text size="sm">Teléfono<br /><strong>{clientData.aditional_client_data.client_phone}</strong></Text>
                  )}
                </Flex>
                {clientData.aditional_client_data.client_address && (
                  <Text size="sm">Dirección<br /><strong>{clientData.aditional_client_data.client_address}</strong></Text>
                )}
              </Flex>
            )
          }
        </Paper>
      )}

      <Flex direction="column" gap={10}>
        <Text fw={600} size="lg">Información financiera</Text>
        <Flex align="center" justify="space-between" wrap="wrap" gap={10}>
          <Flex wrap={"wrap"} gap={10} justify={'center'} align={"center"}>
            <Text size="sm">Saldo total: {
              parseFloat(selectedClientData.total_debts) > 0 ? (
                <Badge color="red" size="lg" variant="filled">
                  {parseFloat(selectedClientData.total_debts.toString()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                </Badge>
              ) : (
                <Badge color="green" size="lg" variant="filled">
                  Sin deuda
                </Badge>
              )
            }</Text>

            {sendSuccess ? (
              <Notification withCloseButton={false} icon={<MdCircleNotifications size={18} />} title="Recordatorio enviado" color="green">
                El cliente fue notificado de su deuda
              </Notification>
            )
              : sendError ? (
                <Notification withCloseButton={false} icon={<MdNotificationImportant size={18} />} title="Error al enviar el recordatorio" color="maroon"/>
              ) : (
                <Button
                  color='dark'
                  onClick={() => handleSendNotif()}
                  loading={sendingNotif}
                  disabled={gettingFinancialData || sendingNotif || !hasAtLeastOneOverdueDebt()}
                  leftSection={getSendNotifBtnIcon()}
                >{getSendNotifBtnText()}</Button>
              )}

          </Flex>
          <Flex gap={10}>
            <Button
              size="sm"
              variant="outline"
              color="gray"
              leftSection={<TbReportMoney size={18} />}
              onClick={() => setSections("newDebt")}
              disabled={gettingClientData}
            >
              Agregar deuda
            </Button>
            <Button
              size="sm"
              variant="filled"
              color="dark"
              leftSection={<GiTakeMyMoney size={18} />}
              onClick={() => setSections("newdeliver")}
              disabled={gettingClientData}
            >
              Registrar pago
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {gettingFinancialData
        ? <Flex direction={"column"} gap={10}>
          <Skeleton height={20} animate={true} radius="sm" />
          <Skeleton height={20} animate={true} radius="sm" />
          <Skeleton height={20} animate={true} radius="sm" />
          <Skeleton height={20} animate={true} radius="sm" />
          <Skeleton height={20} animate={true} radius="sm" />

        </Flex>
        : <FinancialTabs />
      }
    </Flex>
  )
}

export default ClientInfo
