import { Button, Flex, Input, Notification, Text, Textarea } from "@mantine/core";
import "./NewDeliver.css";
import { DatePicker, DateValue } from "@mantine/dates";
import useNewDeliver from "./utils/useNewDeliver";
import dayjs from "dayjs";
import { useAppContext } from "../../../../../../../../Context/AppContext";
import { useEffect } from "react";

function NewDeliver({ closeModal, setSections }) {
    const {
        formData,
        handleChange,
        handleSaveDate,
        handleFinish,
        saved, saving
    } = useNewDeliver();
    const {
        modalsHook: {
            selectedClientData
        }
    } = useAppContext()

    const { width } = useAppContext();

    const isMobile = width < 700;

    useEffect(()=>{
        if(saved){
            const timeout = setTimeout(() => setSections("home"),1000)
            return () => clearTimeout(timeout)
        }
    },[saved])

    return (
        <div
            className="new-deliver-container"
        >
            <Text>Nueva entrega para {selectedClientData.client_name} | {parseFloat(selectedClientData.total_debts.toString()).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</Text>
            {saved
                ? <Notification
                    title="Entrega guardada exitosamente"
                    withBorder
                    radius={"xs"}
                    color='lime'
                >
                </Notification>
                : (
                    <form style={{ height: "100%", flex: 1 }} onSubmit={handleFinish}>
                        <Flex
                            direction={isMobile ? "column" : "row"}
                            justify={isMobile ? "center" : "space-evenly"}
                            align={"flex-start"}
                            gap={10}
                            style={{ height: "100%", width: "100%" }}
                        >

                            <Flex
                                direction="column"
                                justify="space-between"
                                align={isMobile ? "center" : "flex-start"}
                                gap={10}
                                style={{ flex: 1, height: "100%", width: "100%" }}
                            >
                                <Input.Wrapper
                                    label="Monto de entrega"
                                    required
                                    style={{
                                        width: "100%"
                                    }}
                                >
                                    <Input
                                        name="deliver_amount"
                                        type="text"

                                        value={formData.deliver_amount}
                                        onChange={handleChange}
                                        placeholder="Monto de entrega"
                                        required
                                    />
                                </Input.Wrapper>

                                <Input.Wrapper
                                    label="Detalle de la entrega"
                                    style={{
                                        flex: 1,
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                >
                                    <Textarea
                                        name="deliver_details"
                                        value={formData.deliver_details}
                                        onChange={handleChange}
                                        placeholder="Escribí un detalle de la entrega..."

                                        autosize
                                        minRows={8}
                                        style={{
                                            flex: 1,
                                        }}
                                    />
                                </Input.Wrapper>
                            </Flex>

                            <Flex
                                direction={width < 500 ? "column" : "row"}
                                justify={"space-between"}
                                align={width < 500 ? "center" : "flex-start"}
                                gap={10}
                                style={{
                                    flex: 1,
                                    height: "100%",
                                    width: "100%"
                                }}
                            >
                                <Input.Wrapper
                                    label={
                                        `Fecha de deuda${dayjs(formData.deliver_date).format("DD/MM/YYYY") === "Invalid Date"
                                            ? ""
                                            : `: ${dayjs(formData.deliver_date).format("DD/MM/YYYY")}`
                                        }`
                                    }
                                    required
                                    style={{ marginTop: isMobile ? 20 : 0 }}
                                >
                                    <DatePicker
                                        onChange={handleSaveDate}
                                        value={(formData.deliver_date as unknown as Date) || null}
                                    />

                                </Input.Wrapper>
                                {width < 700 && (
                                    <Button
                                        fullWidth
                                        color="dark"
                                        type="submit"
                                        loading={saving}
                                        disabled={saving}
                                    >
                                        Guardar entrega
                                    </Button>
                                )}
                            </Flex>

                        </Flex>
                        {width >= 700 && (
                            <Button
                                type="submit"
                                color="dark"
                                mt={10}
                                loading={saving}
                                disabled={saving}
                            >Guardar entrega</Button>
                        )}
                    </form>
                )
            }
        </div>
    );
}

export default NewDeliver;
