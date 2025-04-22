interface RegisterEmployeeTemplate{
    username: string,
    user_email: string
    user_password: string
    business_name?: string
    admin_name: string
}

export const RegisterEmployeeTemplate = ({username, user_email, user_password, admin_name, business_name}: RegisterEmployeeTemplate) => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notificación de Creación de Cuenta - Fynkapp</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #ffffff;
      color: #000000;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #000000;
      text-align: center;
    }
    .email-header {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .email-body {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 30px;
    }
    .email-data {
      margin: 15px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .email-footer {
      font-size: 14px;
      color: #555555;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      ¡Bienvenido a Fynkapp!
    </div>
    <div class="email-body">
      <p>Un administrador ha creado una cuenta para ti como empleado en <span>{{business_name}}</span>. A continuación, encontrarás los detalles de tu cuenta:</p>
      <div class="email-data">
        Nombre de usuario: <span>{{user_name}}</span>
      </div>
      <div class="email-data">
        Email: <span>{{user_email}}</span>
      </div>
      <div class="email-data">
        Contraseña: <span>{{user_password}}</span>
      </div>
      <p>Esta cuenta fue creada por el administrador: <span>{{admin_name}}</span>.</p>
      <p>Guarda esta información en un lugar seguro y no la compartas con nadie.</p>
    </div>
    <div class="email-footer">
      © 2023 Fynkapp. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>`
} 