import React, { useState } from 'react'
import { useAppContext } from '../../../Context/AppContext'
import { CreateUserForm } from '../../../Context/Typescript/AuthenticationTypes'
import { Button, Input, PasswordInput } from '@mantine/core'

function CreateUser({ toggleForm }) {
  const {
    authHook: {
      registerUser 
    }
  } = useAppContext()

  const [loggingIn, setLoggingIn] = useState(false)
  const [formValues, setFormValues] = useState<CreateUserForm>({
    user_email: '',
    user_password: '',
    user_name: '',
    confirm_password: '',
  })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingIn(true)
    const result = await registerUser(formValues)
    setLoggingIn(false)
    if(result) toggleForm(false)
  }

  return (
    <div className='login-container'>
      <h3>Crear cuenta en Fynkapp</h3>
      <form className='login-form' onSubmit={handleCreateUser}>
        <Input.Wrapper
          className='user_email'
          label="Correo"
          required
          style={{ width: "100%" }}
        >
          <Input
            type="email"
            onChange={(e) => setFormValues({ ...formValues, user_email: e.target.value })}
            value={formValues.user_email}
            className='login-form-input'
          />
        </Input.Wrapper>

        <Input.Wrapper
          className='user_name'
          label="Nombre de usuario"
          required
          style={{ width: "100%" }}
        >
          <Input
            type="text"
            onChange={(e) => setFormValues({ ...formValues, user_name: e.target.value })}
            value={formValues.user_name}
            className='login-form-input'
          />
        </Input.Wrapper>

        <Input.Wrapper
          className='user_password'
          label="Contraseña"
          required
          style={{ width: "100%" }}
        >
          <PasswordInput
            onChange={(e) => setFormValues({ ...formValues, user_password: e.target.value })}
            value={formValues.user_password}
            className='login-form-input'
          />
        </Input.Wrapper>

        <Input.Wrapper
          className='confirm_user_password'
          label="Repita una vez más"
          required
          style={{ width: "100%" }}
        >
          <PasswordInput
            onChange={(e) => setFormValues({ ...formValues, confirm_password: e.target.value })}
            value={formValues.confirm_password}
            className='login-form-input'
          />
        </Input.Wrapper>

        <Button
          color='dark'
          type='submit'
          fullWidth
          loading={loggingIn}
          disabled={loggingIn}
        >
          Crear cuenta
        </Button>
      </form>

      <Button
        color='dark'
        type='button'
        size='md'
        style={{ alignSelf: "flex-start" }}
        onClick={() => toggleForm(false)}
        disabled={loggingIn}
      >
        ¿Ya tienes una cuenta?
      </Button>
    </div>
  )
}

export default CreateUser
