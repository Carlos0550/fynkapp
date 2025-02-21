import "./App.css"
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout/Layout'
import UsersManager from './Users/UsersManager'
import UserDashboard from "./UserDashboard/UserDashboard"

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout content={<UserDashboard />} />} />
      <Route path='/auth-user' element={<UsersManager />} />
    </Routes>
  )
}

export default App