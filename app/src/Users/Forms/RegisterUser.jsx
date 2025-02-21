import React from 'react'
import "./UserFormStyles.css"
import { useAppContext } from '../../Context/AppContext'
import useRegisterValidation from './utils/useRegisterValidation'
function RegisterUser() {
  const { width, setFormSelection } = useAppContext()
  const { registerFormInputsRef, onFinish, errors } = useRegisterValidation()
  return (
    <div className='login-user-container'>
      <form onSubmit={onFinish} className='login-user-form' style={{ minWidth: width < 768 ? "" : "900px" }} ref={registerFormInputsRef}>
        <h2>Creá tu cuenta en Fynkapp</h2>
        <div className="register-labels-box">
          <label htmlFor="user_name">Nombre: 
            <input type="text" id="user_name" name="user_name" /> 
            {errors.user_name && <span>{errors.user_name}</span>}
          </label>

          <label htmlFor="user-lastname">Apellido: 
            <input type="text" id="user_last_name" name="user_last_name" />
            {errors.user_last_name && <span>{errors.user_last_name}</span>}
          </label>
        </div>

        <div className="register-labels-box">
          <label htmlFor="user_email">Correo:
            <input type="email" id="user_email" name="user_email" />
            {errors.user_email && <span>{errors.user_email}</span>}
          </label>
          <label htmlFor="user_password">Contraseña:
            <input type="password" id="user_password" name="user_password" />
            {errors.user_password && <span>{errors.user_password}</span>}
          </label>

          <label htmlFor="confirm_password">Confirmar contraseña:
            <input type="password" id="confirm_password" name="confirm_password" />
            {errors.confirm_password && <span>{errors.confirm_password}</span>}
          </label>
        </div>
        <div className="login-form-buttons-box">
          <button type="submit">Crear cuenta</button>
          <button type='button' onClick={() => setFormSelection(0)}>Ya tengo cuenta</button>
        </div>
      </form>
    </div>
  )
}

export default RegisterUser