import { Avatar, Badge, Card, CheckIcon, Flex, Group, Text } from '@mantine/core'
import { useAppContext } from '../../../Context/AppContext'

function ClientsWithHighestRisk() {
    const {
        resumeHook: {
            resumes: {
                worst_customers
            }
        },
        getInitials,
        width: wd
    } = useAppContext()

    const getRiesgoColor = (riesgo: number) => {
        if (riesgo >= 0.7) return 'red';
        if (riesgo >= 0.5) return 'yellow';
        return 'teal';
    };

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            style={{ width: wd < 768 ? "100%" : 520, height: "min-content" }}
        >
            <Flex

                align={"flex-start"}
                direction={"column"}
            >
                <Text
                    ff={'Roboto Slab'}
                    size={"1.5rem"}
                    fw={700}
                    c={"#2c2c2c"}
                >
                    Clientes riesgosos
                </Text>
                <Text
                    ff={'Roboto Slab'}
                    size="sm"
                    fw={400}
                    c={"#2c2c2c"}
                >
                    Estos clientes representan un riesgo para prestar tu producto o servicio.
                </Text>
                {worst_customers && worst_customers.length > 0 ? (
                    worst_customers.map((customer) => (
                        <Flex key={customer.id} direction={"column"} align={"center"} w={"100%"}>

                            <Flex justify={"space-between"} align={"center"} w={"100%"}>
                                <Flex mt={10} align={"center"} justify='flex-start' gap={10}>
                                    <Avatar>{getInitials(customer.name)}</Avatar>
                                    <Text fw={380}>{customer.name}</Text>
                                </Flex>
                                <Badge
                                    radius="xl"
                                    color={getRiesgoColor(customer.riesgo)}
                                    variant='light'
                                >
                                    Riesgo: {(customer.riesgo * 100).toFixed(1)}%
                                </Badge>
                            </Flex>
                        </Flex>
                    ))
                ) : (
                    <Flex
                        align='center' justify='flex-start' gap={5}
                    >
                        <Text
                            ff={'Roboto Slab'}
                            size="sm"

                            fw={400}
                            c={"#2c2c2c"}
                        >
                            No hay clientes riesgosos hasta el momento
                        </Text> <Avatar size={"sm"} bg={"green"}><CheckIcon size={15} color='white' /></Avatar>
                    </Flex>
                )}
            </Flex>
        </Card>
    )
}

export default ClientsWithHighestRisk
