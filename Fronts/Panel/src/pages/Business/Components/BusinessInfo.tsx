import { Badge, Button, Card, Divider, Flex, Group, Loader, Popover, PopoverDropdown, PopoverTarget, Radio, Text } from '@mantine/core'
import { useAppContext } from '../../../Context/AppContext'
import { FaBriefcase, FaEdit, FaEnvelope, FaPhone, FaRoad, FaWhatsapp } from 'react-icons/fa'
import { useState } from 'react'
import { NotifOptions } from '../../../Context/Typescript/BusinessTypes'
import { MdOutlineSettings } from 'react-icons/md'

function BusinessInfo() {
    const {
        authHook: { loginData: { user_name } },
        modalsHook: {
            setEditingBusinessData,
            openBusinessModal
        },
        businessHook: {
            setNotiOption,
            notiOption,
            changeNotificationOption,
            businesData
        },
        width
    } = useAppContext()
    const [popoverOpened, setPopoverOpened] = useState(false)

    const isMobile = width < 768

    const handleEditThisBusiness = () => {
        setPopoverOpened(false)
        setEditingBusinessData({
            business_id: businesData!.business_id,
            business_address: businesData!.business_address || "",
            business_name: businesData!.business_name || "",
            business_phone: businesData!.business_phone || "",
            isEditing: true
        })
        openBusinessModal()
    }

    const [changing, setChanging] = useState({
        type: null as NotifOptions | null,
        doing: false
    })
    const handleChangeNotifs = async (option: NotifOptions) => {
        setChanging({
            type: option,
            doing: true
        })
        const result = await changeNotificationOption(option, businesData!.business_id!)
        setChanging({
            type: null,
            doing: false
        })
        if (result) {
            setNotiOption(option)
        }
    }


    return (
        <Flex
            wrap="wrap"
            justify={isMobile ? "center" : "flex-start"}
            gap="md"
            w="100%"
        >
            {businesData && Object.keys(businesData).length > 0 && (
                <Flex direction="column" w="100%" h="100%" gap="lg" p="md">
                    <Flex gap={5} w={"100%"} justify={"space-between"} align={"flex-start"}>
                        <Flex direction="column" gap={5}>
                            <Text ff="Roboto Slab" size="1.3rem" fw={700} c="#2c2c2c">
                                Información del negocio
                            </Text>
                            <Text ff="Roboto Slab" fw={500} c="#2c2c2c">
                                <Flex align="center" gap={5}><FaBriefcase /> {businesData.business_name}</Flex>
                            </Text>
                            <Text ff="Roboto Slab" fw={500} c="#2c2c2c">
                                <Flex align="center" gap={5}><FaPhone /> {businesData.business_phone}</Flex>
                            </Text>
                            <Text ff="Roboto Slab" fw={500} c="#2c2c2c">
                                <Flex align="center" gap={5}><FaRoad /> {businesData.business_address || "Sin dirección"}</Flex>
                            </Text>
                        </Flex>

                        <Group>
                            <Popover withArrow opened={popoverOpened} closeOnEscape onChange={setPopoverOpened}>
                                <PopoverTarget>
                                    <Button variant="light" color="dark" onClick={() => setPopoverOpened(true)}>
                                        <MdOutlineSettings />
                                    </Button>
                                </PopoverTarget>
                                <PopoverDropdown>
                                    <Flex direction="column" gap={5}>
                                        <Button leftSection={<FaEdit />} variant="outline" onClick={handleEditThisBusiness}>
                                            Editar datos
                                        </Button>
                                    </Flex>
                                </PopoverDropdown>
                            </Popover>
                        </Group>
                    </Flex>

                    <Divider my="sm" label="Panel del negocio" labelPosition="center" />

                    <Flex direction="column" gap="md">

                        <Card withBorder shadow="xs" radius="md" padding="lg" mb={5}>
                            <Flex direction="column" gap="md">
                                <Text fw={700}>Notificaciones automáticas</Text>

                                <Flex justify="space-between" align="center">
                                    <Flex align="center" gap="sm">
                                        {changing.doing && changing.type === "whatsapp" ? (
                                            <Loader size={"xs"} type="dots" color="indigo" />
                                        ) : (
                                            <Radio value="whatsapp" onClick={() => handleChangeNotifs("whatsapp")} disabled={changing.doing} checked={notiOption === 'whatsapp'} />
                                        )}
                                        <FaWhatsapp />
                                        <Text size="sm" fw={500}>Solo WhatsApp</Text>
                                    </Flex>
                                </Flex>
                                <Text size="xs" c="dimmed">
                                    Se notificará al cliente exclusivamente por WhatsApp (si el mismo lo proporcionó).
                                </Text>

                                <Flex justify="space-between" align="center">
                                    <Flex align="center" gap="sm">
                                        {changing.doing && changing.type === "email" ? (
                                            <Loader size={"xs"} type="dots" color="indigo" />
                                        ) : (
                                            <Radio value="email" onClick={() => handleChangeNotifs("email")} disabled={changing.doing} checked={notiOption === 'email'} />
                                        )}
                                        <FaEnvelope />
                                        <Text size="sm" fw={500}>Solo correo electrónico</Text>
                                    </Flex>
                                </Flex>
                                <Text size="xs" c="dimmed">
                                    Se enviará el aviso solo por correo electrónico (si el mismo lo proporcionó).
                                </Text>

                                <Flex justify="space-between" align="center">
                                    <Flex align="center" gap="sm">
                                        {changing.doing && changing.type === "both" ? (
                                            <Loader size={"xs"} type="dots" color="indigo" />
                                        ) : (
                                            <Radio value="both" onClick={() => handleChangeNotifs("both")} disabled={changing.doing} checked={notiOption === 'both'} />
                                        )}

                                        <FaWhatsapp />
                                        <Text size="sm" fw={500}>WhatsApp + Correo</Text>
                                        <Badge color="teal" size="xs">Recomendado</Badge>
                                    </Flex>
                                </Flex>
                                <Text size="xs" c="dimmed">
                                    Se notificará siempre por WhatsApp, pero en caso de error se enviará por correo (si está disponible).
                                </Text>

                                <Divider my="sm" />
                                <Text size="md" fw={500}>Plantilla de mensaje automático</Text>
                                <Text size="sm" fw={400}>Este es un ejemplo del mensaje que se enviará a los clientes aplicable en ambos medios de notificación:</Text>
                                <Card bg="gray.0" padding="md" radius="sm" withBorder>
                                    <Text size="sm" style={{ whiteSpace: 'pre-line' }} c="gray.8">
                                        Hola Jhon Doe, esperamos que este mensaje le encuentre muy bien, Este es un simple recordatorio de que tiene una deuda pendiente de $37.500 ARS, la cual se encuentra vencida hace 3 días en {businesData.business_name}.{'\n'}
                                        Le pedimos encarecidamente que se comunique con {user_name} al {businesData.business_phone} lo antes posible para resolver esta situación.
                                        {businesData.business_address ? `\nO si lo prefiere resolver personalmente, también puede acercarse a ${businesData.business_address}.` : ''}{'\n'}
                                        ¡Gracias por su atención y disculpe las molestias!{'\n\n'}
                                        Fynkapp | No responder este mensaje automatizado.
                                    </Text>
                                </Card>
                            </Flex>
                        </Card>
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}

export default BusinessInfo
