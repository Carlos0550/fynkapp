import React, { useEffect, useState } from 'react'
import "./usersManager.css"

import LoginUser from './Forms/LoginUser'
import RegisterUser from "./Forms/RegisterUser"
import { useAppContext } from '../Context/AppContext'

function UsersManager() {
    const { formSelection } = useAppContext()
    const [isVisible, setIsVisible] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)
    const [showForms, setShowForms] = useState(false) 

    useEffect(() => {
        const fadeOutTimer = setTimeout(() => {
            setFadeOut(true) 
        }, 2000)

        const removeTimer = setTimeout(() => {
            setIsVisible(false)
            setShowForms(true) 
        }, 3000)

        return () => {
            clearTimeout(fadeOutTimer)
            clearTimeout(removeTimer)
        }
    }, [])

    return (
        <div className='users-manager-container'>
            {isVisible && (
                <div className={`first-time-container ${fadeOut ? "fade-out" : "fade-in"}`}>
                    <h1 style={{
                        textAlign: "center"
                    }}>Bienvenido a Fynkapp</h1>
                </div>
            )}
            
            {showForms && (
                <div className="form-container fade-in">
                    {formSelection === 0 ? <LoginUser/> : <RegisterUser/>}
                </div>
            )}
        </div>
    )
}

export default UsersManager
