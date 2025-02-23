import "./App.css"
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout/Layout'
import UsersManager from './Users/UsersManager'
import UserDashboard from "./UserDashboard/UserDashboard"
import ClientsManager from "./Clients/ClientsManager.tsx"

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout content={<UserDashboard />} />} />
      <Route path='/auth-user' element={<UsersManager />} />
      <Route path="/clients/*" element={<Layout content={<ClientsManager/>}/>}/>
    </Routes>
  )
}

export default App