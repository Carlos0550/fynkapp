import { useEffect, useState } from "react"
import "./Authentication.css"
import CreateUser from "./CreateUserForm/CreateUser"
import LoginUser from "./LoginUserForm/LoginUser"
function Authentication() {
    const [showForms, setShowForms] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [hiddenWelcome, setHiddenWelcome] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setHiddenWelcome(true)
        }, 2000)
        const timeout2 = setTimeout(() => {
            setShowForms(true)
        },3000)
        return () => {
            clearTimeout(timeout)
            clearTimeout(timeout2)
        }
    }, [])
    return (
        <div className="authentication-container">
            <div className={hiddenWelcome ? "authentication-welcome hidden" : "authentication-welcome"}>
                <h1>Bienvenido a Fynkapp</h1>
                <p>Tu aliado en el control financiero de tus clientes</p>
            </div>
            {hiddenWelcome && showForms &&(
                <div className="authentication-forms">
                    {
                        showRegister
                            ? <CreateUser toggleForm={setShowRegister}/>
                            : <LoginUser toggleForm={setShowRegister}/>
                    }
                </div>
            )}
        </div>
    )
}

export default Authentication
