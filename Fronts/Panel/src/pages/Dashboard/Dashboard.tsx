import { useState } from 'react'
import "./Dashboard.css"
import { Box, Button, Card, Flex, Input, Text } from '@mantine/core'
import { FaBriefcase, FaPlus, FaSearch } from "react-icons/fa";
import Clients from './components/Clients/Clients'
import { useAppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
  const [searchInput, setSearchInput] = useState("");
  const {
    businessHook: {
      businesData
    },
    authHook:{
      loginData: { user_name }
    }
  } = useAppContext()
  const navigate = useNavigate()
  return (
    <div className='dashboard-container'>

      {!businesData || Object.keys(businesData).length === 0 ? (
        <Flex w={"100%"} direction="column" gap={4} h={"100vh"} justify={"center"} align={"center"}>
          <Card withBorder shadow="sm" radius="md" w="100%" maw={600}>
            <Flex direction="column" align="center" justify="center" gap="xs" p="md">

              <Text ff="Roboto Slab" ta="center" size="lg" fw={600}>
                Bien hecho {user_name}, el próximo paso es configurar tu negocio
              </Text>
              <Text c="dimmed" ta="center" fz="sm">
                Cuando lo termines, podrás agregar clientes deudas y sus pagos.
              </Text>
              <Button
                mt="sm"
                variant="light"
                color="dark"
                leftSection={<FaBriefcase size={14} />}
                onClick={() => navigate("/business")}
              >
                Ir a sección de mi negocio
              </Button>
            </Flex>
          </Card>
        </Flex>
      ) : (
        <Box>
          <div className="dashboard-search-container">
            <Input
              placeholder='Buscar cliente'
              className='dashboard-search-input'
              leftSection={<FaSearch />}
              radius={"md"}
              size='md'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Clients searchInput={searchInput} />
        </Box>

      )}
    </div>
  )
}

export default Dashboard
