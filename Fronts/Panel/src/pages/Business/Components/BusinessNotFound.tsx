import { Card, Flex, Text, Button } from '@mantine/core'
import { FaExclamationTriangle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function BusinessNotFound() {
  const navigate = useNavigate()

  return (
    <Flex align="center" justify="center" h="100%" w="100%" p="md">
      <Card shadow="sm" radius="md" withBorder maw={400} w="100%" p="lg">
        <Flex direction="column" align="center" gap="sm">
          <FaExclamationTriangle size={40} color="#FFA500" />
          <Text ff="Roboto Slab" size="lg" fw={600} ta="center">
            Negocio no encontrado
          </Text>
          <Text c="dimmed" fz="sm" ta="center">
            No pudimos encontrar la información del negocio solicitado. 
            Es posible que hubo un problema en el servidor o que el enlace esté roto.
          </Text>
          <Button variant="light" color="dark" mt="md" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
        </Flex>
      </Card>
    </Flex>
  )
}

export default BusinessNotFound
