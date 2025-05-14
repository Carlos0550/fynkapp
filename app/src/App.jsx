import "./App.css"
import { Routes, Route } from 'react-router-dom'

import Layout from "./Layout/Layout"
import Dashboard from "./pages/Dashboard/Dashboard"
import Authentication from "./pages/Authentication/Authentication"
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout content={<Dashboard/>} />} />
      <Route path="/authentication" element={<Authentication/>} />
    </Routes>
  )
}

export default App