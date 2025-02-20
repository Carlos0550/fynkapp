import React from 'react'
import "./UserFormStyles.css"
function LoginUser({setFormSelection}) {
  return (
    <div className='login-user-container'>
      <form className='login-user-form'>
        <h2 className='login-user-form-title'>Iniciá sesión en Fynkapp</h2>
        <label htmlFor="user-email">Correo:
          <input type="email" id="user-email" name="user-email" />
        </label>
        <label htmlFor="user-password">Contraseña:
          <input type="password" id="user-password" name="user-password" />
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