import { Button, Flex, Input } from "@mantine/core"
import useBusinessForm from "./utils/useBusinessForm"

interface Props{
    onClose: () => void
}
function BusinessForm({
    onClose
}:Props) {
    const {
        inputChange,
        formData,
        onFinish,
        creating
    } = useBusinessForm({
        onClose
    })
    return (
        <Flex
            direction={"column"}
            gap={"md"}
            w={"100%"}

        >
            <Input.Wrapper
                label="Nombre del negocio"
                required
                w={"100%"}
            >
                <Input
                    w={"100%"}
                    name="business_name"
                    onChange={inputChange}
                    value={formData.business_name}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label="Teléfono de contácto"
                required
                w={"100%"}
            >
                <Input
                    w={"100%"}
                    name="business_phone"
                    onChange={inputChange}
                    value={formData.business_phone}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label="Dirección Física (Opcional)"
                w={"100%"}
            >
                <Input
                    w={"100%"}
                    name="business_address"
                    onChange={inputChange}
                    value={formData.business_address}
                />
            </Input.Wrapper>

            <Button
                color="dark"
                onClick={onFinish}
                loading={creating}
                disabled={creating}
            >Guardar</Button>
        </Flex>
    )
}

export default BusinessForm
