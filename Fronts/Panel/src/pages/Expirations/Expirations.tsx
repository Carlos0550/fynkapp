import { Table, Text, Badge, Flex, Box, Button } from "@mantine/core"
import { FaCalendarTimes, FaUser, FaClock, FaMoneyBillAlt } from "react-icons/fa"

const mockExpirations = [
  {
    id: 1,
    clientName: "Jhon Doe",
    dueDate: "2025-05-25",
    amount: 37500,
  },
  {
    id: 2,
    clientName: "María Pérez",
    dueDate: "2025-05-28",
    amount: 9500,
  },
  {
    id: 3,
    clientName: "Lucas Fernández",
    dueDate: "2025-05-20",
    amount: 12800,
  },
]

function getDaysLate(dueDate: string) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = now.getTime() - due.getTime()
  return Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 0)
}

function Expirations() {
  return (
    <Flex direction="column" gap="md" p="md">
      <Text size="xl" fw={700} ff="Roboto Slab">📆 Vencimientos</Text>

      {mockExpirations.length === 0 ? (
        <Text c="dimmed">No hay deudas vencidas actualmente.</Text>
      ) : (
        <Table
          highlightOnHover
          withTableBorder
          withColumnBorders
          striped
          verticalSpacing="sm"
        >
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
            {mockExpirations.map((exp) => {
              const daysLate = getDaysLate(exp.dueDate)
              const estado = daysLate >= 15 ? "Crítico" : daysLate >= 7 ? "Urgente" : "Pendiente"
              const color = daysLate >= 15 ? "red" : daysLate >= 7 ? "orange" : "yellow"

              return (
                <Table.Tr key={exp.id}>
                  <Table.Td>{exp.clientName}</Table.Td>
                  <Table.Td>${exp.amount.toLocaleString("es-AR")}</Table.Td>
                  <Table.Td>{new Date(exp.dueDate).toLocaleDateString()}</Table.Td>
                  <Table.Td>{daysLate}</Table.Td>
                  <Table.Td><Badge color={color}>{estado}</Badge></Table.Td>
                  <Table.Td>
                    <Box>
                        <Button color="dark">Enviar recordatorio</Button>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      )}
    </Flex>
  )
}

export default Expirations
