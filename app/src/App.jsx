import "./App.css"
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout/Layout'
import UsersManager from './Users/UsersManager'
import UserDashboard from "./UserDashboard/UserDashboard"
import ClientsManager from "./Clients/ClientsManager.tsx"
import DebtsManager from "./Debts/DebtsManager.tsx"

// import { useEffect, useRef } from "react"
// import { createClients } from "./test/test_populate_db.js"

function App() {
  // const alreadyTestes = useRef(false)
  // useEffect(()=>{
  //   if(alreadyTestes.current) return;
  //   alreadyTestes.current = true
  //   createClients(30)
  // },[])
  return (
    <Routes>
      <Route path='/' element={<Layout content={<UserDashboard />} />} />
      <Route path='/auth-user' element={<UsersManager />} />
      <Route path="/clients" element={<Layout content={<ClientsManager/>}/>}/>
      <Route path="/debts/*" element={<Layout content={<DebtsManager/>}/>}/>
    </Routes>
  )
}

export default App