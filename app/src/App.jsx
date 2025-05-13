import "./App.css"
import { Routes, Route } from 'react-router-dom'

import Layout from "./pages/components/Layout/Layout"
import Dashboard from "./pages/Dashboard"
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout content={<Dashboard/>} />} />
    </Routes>
  )
}

export default App