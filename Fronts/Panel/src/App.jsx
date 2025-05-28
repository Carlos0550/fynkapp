import "./App.css"
import { Routes, Route } from 'react-router-dom'

import Layout from "./Layout/Layout"
import Dashboard from "./pages/Dashboard/Dashboard"
import Authentication from "./pages/Authentication/Authentication"
import MonthlySummary from "./pages/MonthlySummary/MonthlySummary"

import ClientModal from "./pages/Dashboard/components/Modals/ClientsModal/ClientModal"
import React from "react"
function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path='/' element={<Layout content={<Dashboard />} />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/monthly-resume" element={<Layout content={<MonthlySummary />} />} />
      </Routes>
      <ClientModal />
    </React.Fragment>
  )
}

export default App