import "./App.css"
import { Routes, Route } from 'react-router-dom'

import Layout from "./Layout/Layout"
import Dashboard from "./pages/Dashboard/Dashboard"
import Authentication from "./pages/Authentication/Authentication"
import MonthlySummary from "./pages/MonthlySummary/MonthlySummary"

import ClientModal from "./pages/Dashboard/components/Modals/ClientsModal/ClientModal"
import React from "react"
import Business from "./pages/Business/Business"
import NotFound from "./pages/404/NotFound"
import Expirations from "./pages/Expirations/Expirations"
function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="monthly-resume" element={<MonthlySummary />} />
          <Route path="expirations" element={<Expirations />} />
          <Route path="business">
            <Route index element={<Business />} />
          </Route>
        </Route>
        <Route path="authentication" element={<Authentication />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>

      <ClientModal />
    </React.Fragment>
  )
}

export default App