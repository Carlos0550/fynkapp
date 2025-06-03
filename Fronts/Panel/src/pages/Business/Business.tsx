import { Flex, Text, Card, Button } from "@mantine/core"
import { useAppContext } from "../../Context/AppContext"
import { FaBriefcase, FaPlus } from "react-icons/fa"
import BusinessModal from "./Modals/BusinessModal"
import BusinessInfo from "./Components/BusinessInfo"

function Business() {
    const {
        modalsHook: {
            openBusinessModal
        },
        businessHook:{
            businesData
        }
    } = useAppContext()

    return (
        <Flex direction="column" gap="md" w="100%" align="center">
            <Flex w="100%" direction="column" gap={4} align="flex-start">
                <Flex align="center" gap="sm">
                    <FaBriefcase size={20} />
                    <Text ff="Roboto Slab" size="1.5rem" fw={700} c="#2c2c2c">
                        Mi negocio
                    </Text>
                </Flex>
                <Text ff="Roboto Slab" fw={500} c="#2c2c2c">
                    Configurá acá la información de tu negocio
                </Text>
            </Flex>

            {businesData && Object.keys(businesData).length > 0 ? (
                <BusinessInfo/>
            ) : (
                <Flex w={"100%"} direction="column" gap={4} h={"100vh"} justify={"center"} align={"center"}>
                    <Card withBorder shadow="sm" radius="md" w="100%" maw={600}>
                    <Flex direction="column" align="center" justify="center" gap="xs" p="md">

                        <Text ff="Roboto Slab" ta="center" size="lg" fw={600}>
                            Aún no configuraste ningún negocio
                        </Text>
                        <Text c="dimmed" ta="center" fz="sm">
                            Cuando agregues uno, podrás gestionar roles y empleados.
                        </Text>
                        <Button
                            mt="sm"
                            variant="light"
                            color="dark"
                            leftSection={<FaPlus size={14} />}
                            onClick={() => openBusinessModal()}
                        >
                            Crear nuevo negocio
                        </Button>
                    </Flex>
                </Card>
                </Flex>
            )}
            <BusinessModal />
        </Flex>
    )
}

export default Business
