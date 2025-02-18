import React from 'react'
import "./App.css"
import { Routes, Route } from 'react-router-dom'
import ClientsManager from './Clients/ClientsManager'
import Layout from './Layout/Layout'
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />} />
    </Routes>
  )
}

export default App