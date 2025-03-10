import React from 'react';
import "./UserFormStyles.css"
import { useAppContext } from '../../Context/AppContext';
import useRegisterValidation from './utils/useRegisterValidation';
import { Loader } from '@mantine/core';

function RegisterUser() {
  const { width, usersHook } = useAppContext();
  const { setFormSelection } = usersHook;
  const { registerFormInputsRef, onFinish, errors, registerInProgress } = useRegisterValidation();

  return (
    <div className='user-form-container'>
      <form onSubmit={onFinish} className='user-form' ref={registerFormInputsRef}>
        <h2>Crear cuenta en Fynkapp</h2>
        
        <div className="form-group">
          <label htmlFor="user_name">Nombre</label>
          <input type="text" id="user_name" name="user_name" placeholder="Ingresa tu nombre" />
          {errors.user_name && <span className='error-text'>{errors.user_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="user_last_name">Apellido</label>
          <input type="text" id="user_last_name" name="user_last_name" placeholder="Ingresa tu apellido" />
          {errors.user_last_name && <span className='error-text'>{errors.user_last_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="user_email">Correo</label>
          <input type="email" id="user_email" name="user_email" placeholder="correo@ejemplo.com" />
          {errors.user_email && <span className='error-text'>{errors.user_email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="user_password">Contraseña</label>
          <input type="password" id="user_password" name="user_password" placeholder="********" />
          {errors.user_password && <span className='error-text'>{errors.user_password}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm_password">Confirmar contraseña</label>
          <input type="password" id="confirm_password" name="confirm_password" placeholder="********" />
          {errors.confirm_password && <span className='error-text'>{errors.confirm_password}</span>}
        </div>

        <div className="button-group">
          <button type="submit" disabled={registerInProgress}>{registerInProgress && <Loader size={"xs"} color='white'/>} Crear cuenta</button>
          <button type='button' className='secondary-button' onClick={() => setFormSelection(0)} disabled={registerInProgress}>Ya tengo cuenta</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterUser;