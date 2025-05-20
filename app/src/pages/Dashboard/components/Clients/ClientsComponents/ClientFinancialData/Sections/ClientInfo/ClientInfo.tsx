import { Button, Flex, Skeleton, Text, Paper, Box, Badge } from '@mantine/core'
import { FaUserEdit, FaUserSlash } from 'react-icons/fa'
import { TbReportMoney } from 'react-icons/tb'
import { GiTakeMyMoney } from 'react-icons/gi'
import useClientFData from '../../utils/useClientFData'
import { useAppContext } from '../../../../../../../../Context/AppContext'
import FinancialTabs from './Components/FinancialTabs'

function ClientInfo({ setSections }) {
  const {
    gettingClientData,
    clientData,
    aditionalDataLength,
  } = useClientFData()

  const {
    modalsHook: { selectedClientData },
    clientsHook: { setEditingClient },
  } = useAppContext()

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
                <Skeleton height={12} radius="sm" />
                <Skeleton height={12} radius="sm" />
              </Flex>
            ) : (
              <Flex justify="space-between" wrap="wrap" rowGap={5}>
                {clientData.aditional_client_data.client_email && (
                  <Text size="sm">Correo electrónico<br /><strong>{clientData.aditional_client_data.client_email}</strong></Text>
                )}
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
          <Box>
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
            
          </Box>
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
      <FinancialTabs/>
    </Flex>
  )
}

export default ClientInfo
