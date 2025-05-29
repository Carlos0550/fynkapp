import { useState } from 'react'
import "./Dashboard.css"
import { Input } from '@mantine/core'
import { FaSearch } from "react-icons/fa";
import Clients from './components/Clients/Clients'
function Dashboard() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className='dashboard-container'>
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
    </div>
  )
}

export default Dashboard
