import { Button, Input, PasswordInput } from '@mantine/core'
import "./LoginUser.css"
import React, { useState } from 'react'
import { useAppContext } from '../../../Context/AppContext'
import { LoginUserForm } from '../../../Context/Typescript/AuthenticationTypes'
function LoginUser() {
    const {
        authHook: {
            loginUser
        }
    } = useAppContext()

    const [loggingIn, setLoggingIn] = useState(false)
    const [formValues, setFormValues] = useState<LoginUserForm>({
        user_email: '',
        user_password: ''
    })
    const handleLogin = async () => {
        setLoggingIn(true)
        await loginUser(formValues)
        setLoggingIn(false)
    }
    return (
        <div className='login-container'>
            <h3>Iniciar sesión en Fynkapp</h3>
            <form className='login-form' onSubmit={handleLogin}>
                <Input.Wrapper
                    className='user_name'
                    label="Correo"
                    required
                    style={{ width: "100%" }}
                >
                    <Input
                        type="email"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormValues({ ...formValues, user_email: e.target.value })}
                        value={formValues.user_email}
                        className='login-form-input'
                    />
                </Input.Wrapper>
                <Input.Wrapper
                    className='user_password'
                    label="Contraseña"
                    required
                    style={{ width: "100%" }}
                >
                    <PasswordInput
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormValues({ ...formValues, user_password: e.target.value })}
                        value={formValues.user_password}
                        className='login-form-input' />
                </Input.Wrapper>
                <Button
                    color='dark'
                    type='button'
                    fullWidth
                    loading={loggingIn}
                    disabled={loggingIn}
                >
                    Iniciar sesión
                </Button>
            </form>
            <Button
                color='dark'
                type='button'
                size='md'
                style={{
                    alignSelf: "flex-start"
                }}
                loading={loggingIn}
                disabled={loggingIn}
            >
                ¿Ya tienes una cuenta?
            </Button>
        </div>
    )
}

export default LoginUser
