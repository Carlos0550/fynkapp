import { Button, Dialog, Flex, Group, Input, Notification, Text, Textarea } from "@mantine/core"
import "./NewDebt.css"
import { useDisclosure } from "@mantine/hooks";
import { useAppContext } from "../../../../../../../../Context/AppContext";
import { DatePicker } from "@mantine/dates"
import useNewDebt from "./utils/useNewDebt";
import { useEffect } from "react";
import dayjs from "dayjs";
function NewDebt({closeModal}) {
    const {
        modalsHook: {
            selectedClientData
        },
        width
    } = useAppContext()
    const [opened, { toggle, close }] = useDisclosure(false);
    const {
        handleProductsChange,
        handleSaveDate,
        errors,
        handleSaveDebt,
        saving,
        saved, formData
    } = useNewDebt()

    useEffect(()=>{
        if(saved){
            const timeout = setTimeout(() => {
            closeModal()
        },1000)

        return () => {
            clearTimeout(timeout)
        }
        }
    },[saved])
    return (
        <div className="new-debt-container">
            <h2>Añadir deuda para {selectedClientData.client_name}</h2>
            {saved &&
                <Notification
                    title="Deuda guardado exitosamente"
                    withBorder
                    withCloseButton={false}
                    radius={"xs"}
                    color='lime'
                >
                </Notification>
            }
            {!saved && (
                <form onSubmit={handleSaveDebt}>
                    <Flex
                        direction={width < 700 ? "column" : "row"}
                        justify={width < 700 ? "center" : "space-evenly"}
                        align={width < 700 ? "center" : "flex-start"}
                        gap={10}
                    >
                        <Input.Wrapper
                            label="Productos"
                            description="Ingresá los productos que lleva el cliente"
                            style={{
                                flex: 2,
                                width: "100%",
                                height: "100%"
                            }}
                        >
                            <Textarea
                                name="client_products"
                                placeholder="1 Zapatilla talle 41 15000"
                                autosize
                                minRows={11}
                                maxRows={11}
                                error={errors && errors.length > 0}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleProductsChange(e.target.value)}
                            />
                        </Input.Wrapper>

                        <Flex
                            gap={10}
                            justify={"space-between"}
                            align={"flex-start"}
                        >
                            <Input.Wrapper
                              label={
                                `Fecha de deuda${dayjs(formData.debt_date).format("DD/MM/YYYY") === "Invalid Date" ? "" : `: ${dayjs(formData.debt_date).format("DD/MM/YYYY")}`}`
                              }
                              description="Fecha en la que se emite esta deuda"
                            >
                                <DatePicker
                                    onChange={handleSaveDate}
                                />
                            </Input.Wrapper>
                            {width >= 500 && width < 700 && (
                                <Flex wrap={"wrap"} gap={10} justify={"space-between"} align={"center"}>
                                    <Button
                                        onClick={toggle}
                                        color="blue"
                                        fullWidth={width < 700}
                                    >¿Cómo agregar productos?</Button>
                                    <Button
                                        type="submit"
                                        color="dark"
                                        variant="outline"
                                        loading={saving}
                                        disabled={saving}
                                        fullWidth={width < 700}
                                    >Guardar deuda</Button>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                    {errors && <Text c={"#ff5145"}>{errors}</Text>}
                    {(width <= 500 || width >= 700) && (
                        <Flex wrap={"wrap"} gap={10} justify={"space-between"} align={"center"}>
                            <Button
                                onClick={toggle}
                                color="blue"
                                fullWidth={width < 700}
                            >¿Cómo agregar productos?</Button>
                            <Button
                                type="submit"
                                color="dark"
                                variant="outline"
                                loading={saving}
                                disabled={saving}
                                fullWidth={width < 700}
                            >Guardar deuda</Button>
                        </Flex>
                    )}
                    <Dialog
                        opened={opened}
                        onClose={close}
                        withCloseButton
                        withBorder
                        position={{
                            top: 50,
                            right: 0
                        }}
                    >
                        <Flex direction={"column"} align="flex-start" justify="space-evenly">
                            <Text size="xl" mb="xs" fw={800}>
                                ¿Cómo agregar productos?
                            </Text>
                            <Text size="sm" mb="xs" fw={500}>
                                El formato esperado es el siguiente:
                                <Text fw={800}>CANTIDAD | PRODUCTO | PRECIO</Text>
                            </Text>
                            <Text size="sm" mb="xs" fw={500}>
                                Por ejemplo:
                                <Text fw={800}>1 Zapatilla talle 41 15000</Text>
                            </Text>
                            <Text size="sm" ml="xs">
                                <ul>
                                    <li>No se permite guardar productos con espacios en blanco.</li>
                                    <li>No se permiten productos con comas.</li>
                                    <li>No se permiten productos con puntos.</li>
                                    <li>Los precios deben ser o numeros enteros o decimales con coma "," y no debe contener caracteres como <strong>"$" o "%"</strong>.</li>
                                </ul>
                            </Text>
                        </Flex>
                    </Dialog>
                </form>
            )}
        </div>
    )
}

export default NewDebt
