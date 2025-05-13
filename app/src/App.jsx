import "./App.css"
import { Routes, Route } from 'react-router-dom'

import Layout from "./pages/components/Layout/Layout"
import Dashboard from "./pages/Dashboard"
import UsersManager from "./Users/UsersManager"
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout content={<Dashboard/>} />} />
      <Route path="/auth-user" element={<UsersManager/>} />
    </Routes>
  )
}

export default App