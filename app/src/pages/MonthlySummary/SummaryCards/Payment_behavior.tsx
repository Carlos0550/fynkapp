import { Card, Flex, Progress, Text } from '@mantine/core'
import React from 'react'
import { useAppContext } from '../../../Context/AppContext'

function Payment_behavior() {
  const {
    width: wd,
    resumeHook: {
      resumes: { payment_behavior }
    },
    clientsHook: { clients }
  } = useAppContext()

  const getTotalPercentage = (val: number) => {
    const totalClients = Number(clients.length)
    return (Number(val) / totalClients) * 100
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
     
      style={{ flex: 1, width: wd < 768 ? "100%" : 500 }}
    >
      <Flex direction={"column"} gap={10}>
        <Text ff={'Roboto Slab'} size={"1.5rem"} fw={700} c={"#2c2c2c"}>
          Comportamiento de pagos
        </Text>
        <Text ff={'Roboto Slab'} size={"sm"} fw={400} c={"#2c2c2c"}>
          Comportamiento de los pagos de tus clientes a lo largo del tiempo
        </Text>

        <Card
          mt={10}
          padding="md"
          withBorder
          style={{
            backgroundColor: "#e9fef1",
            borderColor: "#2ea76c",
            transition: "all 150ms ease-in-out",
            cursor: "pointer",
          }}
        >
          <Flex direction="column" gap={10}>
            <Flex justify="space-between" align="center">
              <Flex direction="column" gap={2}>
                <Text ff="Roboto Slab" size="md" fw={600} c="#2c2c2c">
                  0-15 días
                </Text>
                <Text ff="Roboto Slab" size="xs" fw={500} c="#2c2c2c">
                  Pagos puntuales o muy tempranos
                </Text>
              </Flex>
              <Flex direction="column" align="end">
                <Text ff="Roboto Slab" size="sm" fw={600} c="green">
                  {payment_behavior['0-15']?.clientes?.length} clientes
                </Text>
                
              </Flex>
            </Flex>

            <Flex direction="column" gap={4}>
              <Text ff="Roboto Slab" size="xs" fw={400} c="#2c2c2c">
                Porcentaje del total
              </Text>
              <Flex align="center" gap={8}>
                <Progress
                  value={getTotalPercentage(payment_behavior['0-15']?.clientes?.length)}
                  color="green"
                  radius="xl"
                  w="100%"
                />
                <Text ff="Roboto Slab" size="sm" fw={600} c="green">
                  {getTotalPercentage(payment_behavior['0-15']?.clientes?.length).toFixed(0)}%
                </Text>
              </Flex>
            </Flex>

            <Text
              ff="Roboto Slab"
              size="xs"
              fw={500}
              c="#2c2c2c"
              align="center"
              mt={8}
            >
              Click para ver clientes
            </Text>
          </Flex>
        </Card>

        <Card
          mt={10}
          padding="md"
          withBorder
          style={{
            backgroundColor: "#FEFBE9",
            borderColor: "#9FA72E",
            transition: "all 150ms ease-in-out",
            cursor: "pointer",
          }}
        >
          <Flex direction="column" gap={10}>
            <Flex justify="space-between" align="center">
              <Flex direction="column" gap={2}>
                <Text ff="Roboto Slab" size="md" fw={600} c="#2c2c2c">
                  16-30 días
                </Text>
                <Text ff="Roboto Slab" size="xs" fw={500} c="#2c2c2c">
                  Pagos en tiempo y forma correctos
                </Text>
              </Flex>
              <Flex direction="column" align="end">
                <Text ff="Roboto Slab" size="sm" fw={600} c="#9FA72E">
                  {payment_behavior["16-30"]?.clientes?.length} clientes
                </Text>
                
              </Flex>
            </Flex>

            <Flex direction="column" gap={4}>
              <Text ff="Roboto Slab" size="xs" fw={400} c="#2c2c2c">
                Porcentaje del total
              </Text>
              <Flex align="center" gap={8}>
                <Progress
                  value={getTotalPercentage(payment_behavior["16-30"]?.clientes?.length)}
                  color="#9FA72E"
                  radius="xl"
                  w="100%"
                />
                <Text ff="Roboto Slab" size="sm" fw={600} c="#9FA72E">
                  {getTotalPercentage(payment_behavior["16-30"]?.clientes?.length).toFixed(0)}%
                </Text>
              </Flex>
            </Flex>

            <Text
              ff="Roboto Slab"
              size="xs"
              fw={500}
              c="#2c2c2c"
              align="center"
              mt={8}
            >
              Click para ver clientes
            </Text>
          </Flex>
        </Card>

        <Card
          mt={10}
          padding="md"
          withBorder
          style={{
            backgroundColor: "#FEF5E9",
            borderColor: "#A7812E",
            transition: "all 150ms ease-in-out",
            cursor: "pointer",
          }}
        >
          <Flex direction="column" gap={10}>
            <Flex justify="space-between" align="center">
              <Flex direction="column" gap={2}>
                <Text ff="Roboto Slab" size="md" fw={600} c="#2c2c2c">
                  31-60 días
                </Text>
                <Text ff="Roboto Slab" size="xs" fw={500} c="#2c2c2c">
                  Pagos vencidos o tardíos
                </Text>
              </Flex>
              <Flex direction="column" align="end">
                <Text ff="Roboto Slab" size="sm" fw={600} c="A7812E">
                  {payment_behavior["31-60"]?.clientes?.length} clientes
                </Text>
                
              </Flex>
            </Flex>

            <Flex direction="column" gap={4}>
              <Text ff="Roboto Slab" size="xs" fw={400} c="#2c2c2c">
                Porcentaje del total
              </Text>
              <Flex align="center" gap={8}>
                <Progress
                  value={getTotalPercentage(payment_behavior["31-60"]?.clientes?.length)}
                  color="#A7812E"
                  radius="xl"
                  w="100%"
                />
                <Text ff="Roboto Slab" size="sm" fw={600} c="#A7812E">
                  {getTotalPercentage(payment_behavior['0-15']?.clientes?.length).toFixed(0)}%
                </Text>
              </Flex>
            </Flex>

            <Text
              ff="Roboto Slab"
              size="xs"
              fw={500}
              c="#2c2c2c"
              align="center"
              mt={8}
            >
              Click para ver clientes
            </Text>
          </Flex>
        </Card>


        <Card
          mt={10}
          padding="md"
          withBorder
          style={{
            backgroundColor: "#FEE9E9",
            borderColor: "#A72E2E",
            transition: "all 150ms ease-in-out",
            cursor: "pointer",
          }}
        >
          <Flex direction="column" gap={10}>
            <Flex justify="space-between" align="center">
              <Flex direction="column" gap={2}>
                <Text ff="Roboto Slab" size="md" fw={600} c="#2c2c2c">
                  +60 días
                </Text>
                <Text ff="Roboto Slab" size="xs" fw={500} c="#2c2c2c">
                  Pagos muy tardíos
                </Text>
              </Flex>
              <Flex direction="column" align="end">
                <Text ff="Roboto Slab" size="sm" fw={600} c="#A72E2E">
                  {payment_behavior["60+"]?.clientes?.length} clientes
                </Text>
                
              </Flex>
            </Flex>

            <Flex direction="column" gap={4}>
              <Text ff="Roboto Slab" size="xs" fw={400} c="#2c2c2c">
                Porcentaje del total
              </Text>
              <Flex align="center" gap={8}>
                <Progress
                  value={getTotalPercentage(payment_behavior["60+"]?.clientes?.length)}
                  color="#A72E2E"
                  radius="xl"
                  w="100%"
                />
                <Text ff="Roboto Slab" size="sm" fw={600} c="#A72E2E">
                  {getTotalPercentage(payment_behavior["16-30"]?.clientes?.length).toFixed(0)}%
                </Text>
              </Flex>
            </Flex>

            <Text
              ff="Roboto Slab"
              size="xs"
              fw={500}
              c="#2c2c2c"
              align="center"
              mt={8}
            >
              Click para ver clientes
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  )
}

export default Payment_behavior
