import { Card, Flex, Group, Select, Text } from "@mantine/core"
import SummaryCards from "./SummaryCards/SummaryCards"
import { useEffect, useRef } from "react"

import { useAppContext } from "../../Context/AppContext"
import ClientsWithHighestRisk from "./SummaryCards/ClientsWithHighestRisk"
import Payment_behavior from "./SummaryCards/Payment_behavior"
import ClientsWithLowestRisk from "./SummaryCards/ClientsWithLowestRisk"
function MonthlySummary() {
    const {
        resumeHook: {
            getMonthlyResume,
            summaryCards,
            monthsAvailable,
            resumes
        },
        width
    } = useAppContext()

    const alreadyFetched = useRef(false)

    useEffect(() => {
        if (alreadyFetched.current) return
        alreadyFetched.current = true
        getMonthlyResume()
    }, [])

    return (
        <Flex
            direction={"column"}
            h={"100vh"}
            w={"100%"}
        >
            <Group
                wrap="wrap"
                justify="space-between"
                w={"100%"}
                align="center"
            >
                <Flex direction={"column"} gap={10}>
                    <Text
                        ff={'Roboto Slab'}
                        size={"1.5rem"}
                        fw={700}
                        c={"#2c2c2c"}

                    >Resumen de cuenta</Text>
                    <Text
                        ff={'Roboto Slab'}
                        size="sm"
                        fw={500}
                        c={"#2c2c2c"}

                    >Visualiza el rendimiento financiero de tu negocio</Text>
                </Flex>

                {monthsAvailable && monthsAvailable.length > 0 && (
                    <Select
                        value={monthsAvailable[monthsAvailable.length - 1]?.value}
                        data={monthsAvailable}
                        m={5}
                    />
                )}
            </Group>
            {resumes && resumes.monthName && (
                <Text
                    ff={'Roboto Slab'}
                    size={"1.8rem"}
                    fw={700}
                    c={"#2c2c2c"}
                >Resumen de {resumes && resumes.monthName}
                </Text>
            )}
            <Flex justify={"space-evenly"} w={"100%"} wrap={"wrap"} gap="md" mt="xl">
                {summaryCards && summaryCards.length > 0 ? (
                    summaryCards.map((item, index) => (
                        <SummaryCards
                            key={index}
                            {...item}
                        />
                    ))
                ) : (
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        style={{ width: "100%" }}
                    >
                        <Text>No hay información disponible</Text>
                    </Card>
                )}
            </Flex>
            <Flex
                justify={"space-between"}
                w={"100%"}
                gap={20}
                mt="xl"
                p={5}
                direction={width < 768 ? "column" : "row"}
            >
                <Flex
                    direction={"column"}
                    gap={10}
                >
                    <ClientsWithHighestRisk />
                    <ClientsWithLowestRisk />
                </Flex>
                <Payment_behavior />
            </Flex>
        </Flex>
    )
}

export default MonthlySummary
