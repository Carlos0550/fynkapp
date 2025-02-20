import React from 'react'
import "./App.css"
import { Routes, Route } from 'react-router-dom'
import ClientsManager from './Clients/ClientsManager'
import Layout from './Layout/Layout'
import UsersManager from './Users/UsersManager'
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout content={<ClientsManager />}/>} />
      <Route path='/auth-user' element={<UsersManager/>}/>
    </Routes>
  )
}

export default App