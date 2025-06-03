import { Card, Flex, Text, Button } from '@mantine/core'
import { FaQuestionCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <Flex align="center" justify="center" h="100vh" w="100%" p="md">
      <Card shadow="sm" radius="md" withBorder maw={400} w="100%" p="lg">
        <Flex direction="column" align="center" gap="sm">
          <FaQuestionCircle size={40} color="#6c757d" />
          <Text ff="Roboto Slab" size="lg" fw={600} ta="center">
            Página no encontrada
          </Text>
          <Text c="dimmed" fz="sm" ta="center">
            La ruta que intentaste visitar no existe o ha sido movida. Verificá la URL o volvé al inicio.
          </Text>
          <Button variant="light" color="dark" mt="md" onClick={() => navigate('/')}>
            Ir al inicio
          </Button>
        </Flex>
      </Card>
    </Flex>
  )
}

export default NotFound
