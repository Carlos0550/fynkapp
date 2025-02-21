import React from 'react'
import { useAppContext } from "../Context/AppContext.tsx"
function UserDashboard() {
    const { loginData } = useAppContext();

    console.log(loginData)
  return (
    <React.Fragment>
        <h1></h1>
    </React.Fragment>
  )
}

export default UserDashboard