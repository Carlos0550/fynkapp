import React from 'react'
import "./UserFormStyles.css"
import { useAppContext } from '../../Context/AppContext'
import useLoginValidation from "./utils/useLoginValidation.tsx"
function LoginUser() {
  const { setFormSelection } = useAppContext()
  const { onFinish,
    errors,
    userLoginFormRef
  } = useLoginValidation()
  return (
    <div className='login-user-container'>
      <form className='login-user-form' onSubmit={onFinish} ref={userLoginFormRef}>
        <h2 className='login-user-form-title'>Iniciá sesión en Fynkapp</h2>
        <label htmlFor="user-email">Correo:
          <input type="email" id="user_email" name="user_email" />
          {errors.user_email && <span>{errors.user_email}</span>}
        </label>
        <label htmlFor="user-password">Contraseña:
          <input type="password" id="user_password" name="user_password" />
          {errors.user_password && <span>{errors.user_password}</span>}
        </label>
        <div className="login-form-buttons-box">
          <button type="submit">Iniciar sesión</button>
          <button type='button' onClick={() => setFormSelection(1)}>Crear cuenta</button>
        </div>
      </form>
    </div>
  )
}

export default LoginUser